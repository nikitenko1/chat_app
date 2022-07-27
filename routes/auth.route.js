const router = require('express').Router();
const authCtrl = require('./../controllers/authCtrl');
const { isAuthenticated } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.route('/register').post(authCtrl.register);
router.route('/activate').post(authCtrl.activateAccount);
router.route('/login').post(authCtrl.login);
router.route('/refresh_token').get(authCtrl.refreshToken);

router.route('/logout').get(isAuthenticated, authCtrl.logout);

router.route('/edit_profile').patch(isAuthenticated, authCtrl.editProfile);
router
  .route('/change_password')
  .patch(isAuthenticated, authCtrl.changePassword);
router.route('/forget_password').post(authCtrl.forgetPassword);
router.route('/reset_password').patch(authCtrl.resetPassword);

module.exports = router;
