import { useSelector, useDispatch } from 'react-redux';
import Avatar from './Avatar';

const PersonCard = ({
  id,
  avatar,
  name,
  setOpenContactListModal,
  setSelectContact,
}) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const handleClickChat = async () => {
    const data = {
      senderId: auth.user?._id,
      senderName: auth.user?.name,
      senderAvatar: auth.user?.avatar,
      recipientId: id,
      recipientName: name,
      recipientAvatar: avatar,
    };

    dispatch({
      type: 'conversation/add',
      payload: data,
    });

    setOpenContactListModal(false);
    setSelectContact({ _id: id, name, avatar });
  };
  return (
    <div className="flex items-center shadow-md border border-gray-300 rounded-md py-3 px-4 hover:border-orange-300 hover:bg-slate-50 transition-[background, border]">
      <Avatar src={avatar} alt={name} />
      <div className="ml-5">
        <p className="text-lg">{name}</p>
        <button
          className="text-[12px] mt-1 bg-blue-500 text-white font-medium rounded-md py-1 px-2 hover:bg-blue-600 transition-background"
          onClick={handleClickChat}
        >
          CHAT
        </button>
      </div>
    </div>
  );
};

export default PersonCard;
