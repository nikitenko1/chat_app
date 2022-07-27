import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { changePassword } from './../../redux/slices/authSlice';
import Loader from './../global/Loader';

const ChangePasswordModal = ({
  openChangePasswordModal,
  setOpenChangePasswordModal,
  setOpenDropdown,
}) => {
  const [passwordData, setPasswordData] = useState({
    currPassword: '',
    newPassword: '',
    passwordConfirmation: '',
  });

  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const modalRef = useRef();
  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openChangePasswordModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setOpenChangePasswordModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openChangePasswordModal, setOpenChangePasswordModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currPassword)
      return dispatch({
        type: 'alert/alert',
        payload: { errors: 'Please provide current password field.' },
      });

    if (!passwordData.newPassword)
      return dispatch({
        type: 'alert/alert',
        payload: { errors: 'Please provide your new password.' },
      });
    else if (passwordData.newPassword.length < 8)
      return dispatch({
        type: 'alert/alert',
        payload: { errors: 'New password should be at least 8 characters.' },
      });

    if (passwordData.newPassword !== passwordData.passwordConfirmation)
      return dispatch({
        type: 'alert/alert',
        payload: { errors: 'Password confirmation should be matched.' },
      });

    setLoading(true);
    await dispatch(changePassword({ passwordData, token: `${auth.token}` }));
    setLoading(false);
    setPasswordData({
      currPassword: '',
      newPassword: '',
      passwordConfirmation: '',
    });
    setOpenChangePasswordModal(false);
    setOpenDropdown(false);
  };

  return (
    <div
      className={`${
        openChangePasswordModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } modal-background`}
    >
      <div
        ref={modalRef}
        className={`${
          openChangePasswordModal ? 'translate-y-0' : '-translate-y-12'
        } modal-box max-w-[550px] overflow-auto hide-scrollbar`}
      >
        <div className="modal-box-header">
          <h1 className="font-medium text-lg">Change Password</h1>
          <AiOutlineClose
            onClick={() => setOpenChangePasswordModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="currPassword">Current Password</label>
              <div className="flex items-center justify-between border-2 border-gray-400 rounded-md px-3 py-2 mt-3">
                <input
                  type={showCurrPassword ? 'text' : 'password'}
                  id="currPassword"
                  name="currPassword"
                  value={passwordData.currPassword}
                  onChange={handleChange}
                  className="w-full outline-0"
                />
                {showCurrPassword ? (
                  <FaEyeSlash
                    onClick={() => setShowCurrPassword(false)}
                    className="text-gray-500 cursor-pointer"
                  />
                ) : (
                  <FaEye
                    onClick={() => setShowCurrPassword(true)}
                    className="text-gray-500 cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="newPassword">New Password</label>
              <div className="flex items-center justify-between border-2 border-gray-400 rounded-md px-3 py-2 mt-3">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  className="w-full outline-0"
                />
                {showNewPassword ? (
                  <FaEyeSlash
                    onClick={() => setShowNewPassword(false)}
                    className="text-gray-500 cursor-pointer"
                  />
                ) : (
                  <FaEye
                    onClick={() => setShowNewPassword(true)}
                    className="text-gray-500 cursor-pointer"
                  />
                )}
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="passwordConfirmation" className="text-green-600">
                Confirmation Password
              </label>
              <div className="flex items-center justify-between border-2 border-gray-400 rounded-md px-3 py-2 mt-3">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  value={passwordData.passwordConfirmation}
                  onChange={handleChange}
                  className="w-full outline-0"
                />
                {showPasswordConfirmation ? (
                  <FaEyeSlash
                    onClick={() => setShowPasswordConfirmation(false)}
                    className="text-gray-500 cursor-pointer"
                  />
                ) : (
                  <FaEye
                    onClick={() => setShowPasswordConfirmation(true)}
                    className="text-gray-500 cursor-pointer"
                  />
                )}
              </div>
            </div>

            <button
              className={`${
                loading
                  ? 'bg-gray-200 hover:bg-gray-400 cursor-auto'
                  : 'bg-blue-400 hover:bg-blue-600 cursor-pointer'
              } transition-[background] mt-2 text-sm text-white w-full rounded-md py-3`}
            >
              {loading ? <Loader /> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
