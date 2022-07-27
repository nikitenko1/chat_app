import { useState, useEffect, useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaRegUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getDataAPI, patchDataAPI } from './../../utils/fetchData';
import { checkTokenExp } from './../../redux/slices/authSlice';
import Avatar from './../global/Avatar';
import Loader from './../global/Loader';

const SearchPeopleModal = ({
  openSearchPeopleModal,
  setOpenSearchPeopleModal,
  setOpenDropdown,
}) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAddFriend, setLoadingAddFriend] = useState(false);
  const [result, setResult] = useState({});
  const [isFriend, setIsFriend] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setResult({});
      return dispatch({
        type: 'alert/alert',
        payload: { errors: 'Please provide User ID.' },
      });
    }

    const tokenValidityResult = await checkTokenExp(auth.token, dispatch);
    const accessToken = tokenValidityResult ? tokenValidityResult : auth.token;

    setLoading(true);
    await getDataAPI(`user/id/${userId}`, accessToken)
      .then((res) => setResult(res.data))
      .catch((err) => {
        setResult({});
        return dispatch({
          type: 'alert/alert',
          payload: { errors: err.response.data.msg },
        });
      });
    setLoading(false);
  };

  const addFriend = async (id) => {
    const tokenValidityResult = await checkTokenExp(auth.token, dispatch);
    const accessToken = tokenValidityResult ? tokenValidityResult : auth.token;

    setLoadingAddFriend(true);

    await patchDataAPI(`user/add/${id}`, {}, accessToken)
      .then((res) => {
        dispatch({
          type: 'alert/alert',
          payload: { success: res.data.msg },
        });
        dispatch({
          type: 'auth',
          payload: {
            user: {
              ...auth.user,
              friends: [
                {
                  _id: res.data.user._id,
                  name: res.data.user.name,
                  avatar: res.data.user.avatar,
                  userId: res.data.user.userId,
                },
                ...auth.user?.friends,
              ],
            },
            token: accessToken,
          },
        });
        setResult({});
        setUserId('');
        setOpenSearchPeopleModal(false);
      })
      .catch((err) =>
        dispatch({
          type: 'alert/alert',
          payload: { errors: err.response.data.msg },
        })
      );
    setLoadingAddFriend(false);
  };

  useEffect(() => {
    if (Object.keys(result).length > 0) {
      const findUser = auth.user?.friends.find(
        (item) => item._id === result._id
      );
      if (findUser) setIsFriend(true);
    }
  }, [result, auth.user?.friends]);

  const modalRef = useRef();
  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openSearchPeopleModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setOpenSearchPeopleModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openSearchPeopleModal, setOpenSearchPeopleModal]);

  return (
    <div
      className={`${
        openSearchPeopleModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } modal-background`}
    >
      <div
        ref={modalRef}
        className={`${
          openSearchPeopleModal ? 'translate-y-0' : '-translate-y-12'
        } modal-box max-w-[500px] overflow-auto hide-scrollbar`}
      >
        <div className="modal-box-header">
          <h1 className="font-medium text-lg">Search People</h1>
          <AiOutlineClose
            onClick={() => setOpenSearchPeopleModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="p-7">
          <form onSubmit={handleSubmit}>
            <div className="w-full border-2 rounded-md py-2 px-3 flex items-center ">
              <FaRegUser className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="User ID"
                autoComplete="off"
                value={userId.replace(' ', '')}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full outline-0"
              />
            </div>
            <button
              type="submit"
              className={`${loading ? 'bg-blue-300' : 'bg-blue-500'} mt-4 ${
                !loading ? 'hover:bg-blue-600' : undefined
              } transition-[background] w-20 h-9 text-white rounded-md float-right ${
                loading ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              disabled={loading ? true : false}
            >
              {loading ? <Loader /> : 'Search'}
            </button>
            <div className="clear-both" />
          </form>
          {Object.keys(result).length > 0 && (
            <div className="text-center border-2 shadow-md w-fit m-auto rounded-md p-4 mt-6">
              <div className="flex justify-center">
                <Avatar src={result?.avatar} alt={result?.name} />
              </div>
              <h1 className="text-lg my-3">{result?.name}</h1>
              {result?._id !== auth.user?._id && (
                <button
                  className={`${
                    loadingAddFriend ? 'bg-blue-300' : 'bg-blue-500'
                  } ${!loadingAddFriend ? 'hover:bg-blue-600' : undefined} ${
                    loading ? 'cursor-not-allowed' : 'cursor-pointer'
                  } text-sm transition-[background] w-20 h-8 text-white rounded-md`}
                  disabled={loadingAddFriend ? true : false}
                  onClick={() => addFriend(result?.userId)}
                >
                  {loadingAddFriend ? (
                    <Loader />
                  ) : isFriend ? (
                    'Chat'
                  ) : (
                    'Add Friend'
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPeopleModal;
