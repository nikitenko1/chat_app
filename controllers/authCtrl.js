const User = require('./../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendMail = require('./../utils/sendMail');
const {
  generateActivationToken,
  generateAccessToken,
  generateRefreshToken,
} = require('./../utils/generateToken');

const authCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const findEmail = await User.findOne({ email });
      if (findEmail)
        return res.status(400).json({ msg: 'Email has been used before.' });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, email, password: passwordHash };

      const activationToken = generateActivationToken(newUser);

      const url = `${process.env.CLIENT_URL}/activate/${activationToken}`;
      sendMail(email, url, 'Account Activation');

      return res
        .status(200)
        .json({ msg: 'Email activation link has been sent to your email.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  activateAccount: async (req, res) => {
    try {
      const { token } = req.body;
      if (!token)
        return res
          .status(400)
          .json({ msg: 'Invalid account activation token.' });

      const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);
      if (!decoded)
        return res
          .status(400)
          .json({ msg: 'Invalid account activation token.' });

      const user = await User.findOne({ email: decoded.email });
      if (user)
        return res.status(400).json({ msg: `Email has been used before.` });

      const newUser = new User(decoded);
      await newUser.save();

      newUser.userId = newUser._id;
      await newUser.save();

      return res
        .status(200)
        .json({ msg: 'Account has been activated successfully.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email)
        return res.status(400).json({ msg: 'Please provide your email.' });

      if (!password)
        return res.status(400).json({ msg: 'Please provide your password.' });

      const user = await User.findOne({ email }).populate(
        'friends',
        'avatar name userId'
      );
      if (!user) return res.status(404).json({ msg: 'Invalid credential.' });

      loginUser(user, password, res);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie('learnify_rfToken', {
        path: '/api/v1/auth/refresh_token',
      });

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          rf_token: '',
        }
      );

      res.status(200).json({ msg: 'Logout success.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const rfToken = req.cookies.learnify_rfToken;
      if (!rfToken)
        return res.status(400).json({ msg: 'RefreshToken not found.' });

      const decoded = jwt.verify(rfToken, process.env.REFRESH_TOKEN_SECRET);
      if (!decoded.id) return res.status(400).json({ msg: 'Invalid token.' });

      const user = await User.findOne({ _id: decoded.id })
        .select('-password +rf_token')
        .populate('friends', 'avatar name userId');
      if (!user) return res.status(404).json({ msg: 'User not found.' });

      if (rfToken !== user.rf_token)
        return res.status(403).json({ msg: 'Invalid authentication.' });

      const accessToken = generateAccessToken({ id: user._id });
      const refreshToken = generateRefreshToken({ id: user._id }, res);

      await User.findOneAndUpdate(
        { _id: user._id },
        {
          rf_token: refreshToken,
        }
      );

      res.status(200).json({
        user: {
          ...user._doc,
          rf_token: '',
        },
        accessToken,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({ msg: 'Please provide your email' });

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ msg: 'Email not found.' });

      if (user.type !== 'register')
        return res.status(400).json({
          msg: `Account that login with ${user.type} can't recover their password in-app.`,
        });

      const accessToken = generateAccessToken({ id: user._id });
      const url = `${process.env.CLIENT_URL}/reset/${accessToken}`;
      sendMail(email, url, 'Reset Password');

      res
        .status(200)
        .json({ msg: 'Password recovery link has been sent to your email.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;
      if (!token) return res.status(400).json({ msg: 'Invalid token.' });

      if (!password)
        return res
          .status(400)
          .json({ msg: 'Please provide your new password.' });
      else if (password.length < 8)
        return res
          .status(400)
          .json({ msg: 'Password should be at least 8 characters.' });

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!decoded.id) return res.status(400).json({ msg: 'Invalid token.' });

      const passwordHash = await bcrypt.hash(password, 12);
      await User.findOneAndUpdate(
        { _id: decoded.id },
        {
          password: passwordHash,
        }
      );

      return res.status(200).json({ msg: 'Password has been changed.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { currPassword, newPassword } = req.body;
      if (!currPassword || !newPassword)
        return res.status(400).json({ msg: 'Please provide every field.' });

      if (newPassword.length < 8)
        return res
          .status(400)
          .json({ msg: 'New password should be at least 8 characters.' });

      const isPwMatch = await bcrypt.compare(currPassword, req.user.password);
      if (!isPwMatch)
        return res.status(403).json({ msg: 'Current password is incorrect.' });

      if (req.user.type !== 'register')
        return res.status(400).json({
          msg: `Account that login with ${req.user.type} can\'t change their password.`,
        });

      const newPw = await bcrypt.hash(newPassword, 12);
      await User.findOneAndUpdate({ _id: req.user._id }, { password: newPw });
      return res.status(200).json({ msg: 'Password has been changed.' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  editProfile: async (req, res) => {
    try {
      const { name, userId, avatar } = req.body;
      if (!name)
        return res.status(400).json({ msg: 'Please provide your name.' });

      const validUserId = await User.findOne({
        _id: { $ne: req.user._id },
        userId,
      });
      if (validUserId)
        return res.status(400).json({ msg: 'This ID has been taken before.' });

      const newUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          name,
          userId: userId ? userId : req.user._id,
          avatar: avatar ? avatar : req.user.avatar,
        },
        { new: true }
      );

      if (!newUser) return res.status(404).json({ msg: 'User not found.' });

      return res.status(200).json({
        msg: 'Profile has been updated successfully.',
        user: {
          ...newUser._doc,
          password: '',
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const loginUser = async (user, password, res) => {
  const isPwMatch = await bcrypt.compare(password, user.password);
  let msg = '';

  if (user.type === 'register') msg = 'Invalid credential.';
  else msg = `This account login using ${user.type}`;

  if (!isPwMatch) return res.status(400).json({ msg });

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id }, res);

  await User.findOneAndUpdate(
    { _id: user._id },
    {
      rf_token: refreshToken,
    }
  );

  res.status(200).json({
    msg: `Authenticated as ${user.name}`,
    user: {
      ...user._doc,
      password: '',
    },
    accessToken,
  });
};

module.exports = authCtrl;
