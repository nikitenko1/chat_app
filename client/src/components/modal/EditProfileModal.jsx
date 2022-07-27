import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { editProfile } from './../../redux/slices/authSlice';
import Loader from './../global/Loader';

const EditProfileModal = ({
  openEditProfileModal,
  setOpenEditProfileModal,
  setOpenDropdown,
}) => {
  const [userData, setUserData] = useState({
    name: '',
    userId: '',
  });
  const [avatar, setAvatar] = useState();
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
        openEditProfileModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setOpenEditProfileModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openEditProfileModal, setOpenEditProfileModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.name)
      return dispatch({
        type: 'alert/alert',
        payload: { errors: 'Please provide your name.' },
      });

    setLoading(true);
    await dispatch(editProfile({ userData, avatar, token: `${auth.token}` }));

    setLoading(false);
    setAvatar();
    setOpenEditProfileModal(false);
    setOpenDropdown(false);
  };

  useEffect(() => {
    if (auth.user) {
      setUserData({
        name: auth.user?.name,
        userId: auth.user?.userId,
      });
    }
  }, [auth.user]);

  return (
    <div
      className={`${
        openEditProfileModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } modal-background`}
    >
      <div
        ref={modalRef}
        className={`${
          openEditProfileModal ? 'translate-y-0' : '-translate-y-12'
        } modal-box max-w-[550px] overflow-auto hide-scrollbar`}
      >
        <div className="modal-box-header">
          <h1 className="font-medium text-lg">Edit Profile</h1>
          <AiOutlineClose
            onClick={() => setOpenEditProfileModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex items-start">
              <div className="flex-1 mr-3 border-2 shadow-lg rounded-md h-28">
                <img
                  src={avatar ? URL.createObjectURL(avatar) : auth.user?.avatar}
                  alt={auth.user?.name}
                  className="rounded-md object-cover w-full h-full"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                className="flex-3 border rounded-md outline-0"
                onChange={handleChangeImage}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="border border-gray-400 rounded-md w-full h-9 mt-2 outline-0 px-2"
                autoComplete="off"
                value={userData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                name="userId"
                className="border border-gray-400 rounded-md w-full h-9 mt-2 outline-0 px-2"
                autoComplete="off"
                value={userData.userId}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    userId: e.target.value.replace(' ', ''),
                  })
                }
              />
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
            <div className="clear-both" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
