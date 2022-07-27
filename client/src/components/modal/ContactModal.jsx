import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { getDataAPI } from './../../utils/fetchData';
import { checkTokenExp } from './../../redux/slices/authSlice';
import PersonCard from './../global/PersonCard';

const ContactModal = ({
  openContactListModal,
  setOpenContactListModal,
  setSelectContact,
  setOpenDropdown,
}) => {
  const [search, setSearch] = useState('');
  const [friendList, setFriendList] = useState([]);

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const searchFriend = useCallback(async () => {
    const tokenValidityResult = await checkTokenExp(auth.token, dispatch);
    const accessToken = tokenValidityResult ? tokenValidityResult : auth.token;

    await getDataAPI(`user/search?name=${search}`, accessToken)
      .then((res) => setFriendList(res.data.user))
      .catch((err) => console.log(err.response.data.msg));
  }, [search, auth.token, dispatch]);

  useEffect(() => {
    if (search.length > 3) searchFriend();
    else setFriendList(auth.user?.friends);
  }, [searchFriend, auth.user, search]);

  useEffect(() => {
    setFriendList(auth.user?.friends);
  }, [auth.user]);

  const modalRef = useRef();
  /**
   * Hook that alerts clicks outside of the passed ref
   */
  // Hook get from https://stackoverflow.com/a/42234988/8583669
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openContactListModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setOpenContactListModal(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
  }, [openContactListModal, setOpenContactListModal]);

  return (
    <div
      className={`${
        openContactListModal
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } modal-background`}
    >
      <div
        ref={modalRef}
        className={`${
          openContactListModal ? 'translate-y-0' : '-translate-y-12'
        } modal-box max-w-[500px] overflow-auto hide-scrollbar`}
      >
        <div className="modal-box-header">
          <h1 className="font-medium text-lg">Contact List</h1>
          <AiOutlineClose
            onClick={() => setOpenContactListModal(false)}
            className="cursor-pointer"
          />
        </div>
        <div className="py-5 px-5">
          <div className="flex items-center justify-between border border-gray-500 rounded-md p-2 md:w-[400px] w-[100%] float-right">
            <input
              type="text"
              placeholder="Search contact ..."
              autoComplete="off"
              className="outline-0 w-full pr-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AiOutlineSearch className="text-gray-500 text-lg" />
          </div>
          <div className="clear-both"></div>
          {friendList.length === 0 ? (
            <div className="bg-orange-400 text-white rounded-md p-2 text-center mt-6">
              Friend not found
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-auto-fill gap-5">
              {friendList.map((friend, idx) => (
                <PersonCard
                  key={idx}
                  id={friend._id}
                  avatar={friend.avatar}
                  name={friend.name}
                  setOpenContactListModal={setOpenContactListModal}
                  setSelectContact={setSelectContact}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
