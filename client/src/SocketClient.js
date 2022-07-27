import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const spawnNotification = (body, icon, url, title) => {
  let options = { body, icon };
  let n = new Notification(title, options);
  n.onClick = (e) => {
    e.preventDefault();
    window.open(url, '_blank');
  };
};

const SocketClient = () => {
  const dispatch = useDispatch();
  const { auth, status, socket } = useSelector((state) => state);

  useEffect(() => {
    socket.data.emit('joinUser', auth.user);
  }, [socket, auth.user]);

  useEffect(() => {
    socket.data.on('createMessageToClient', (data) => {
      const addConversationData = {
        senderId: data.sender._id,
        senderName: data.sender.name,
        senderAvatar: data.sender.avatar,
        recipientId: data.recipient._id,
        recipientName: data.recipient.name,
        recipientAvatar: data.recipient.avatar,
        media: data.media,
        createdAt: data.createdAt,
        text: data.text,
        audio: data.audio,
        files: data.files,
        call: data.call,
      };

      dispatch({
        type: 'conversation/add',
        payload: addConversationData,
      });

      dispatch({
        type: 'message/create',
        payload: data,
      });

      dispatch({
        type: 'conversation/update',
        payload: data,
      });

      spawnNotification(
        data.sender.name,
        data.sender.avatar,
        'http://localhost:3000',
        `Let's work`
      );
    });

    return () => socket.data.off('createMessageToClient');
  }, [dispatch, socket]);

  useEffect(() => {
    socket.data.on('typingToClient', (data) => {
      dispatch({
        type: 'type/type',
        payload: data,
      });
    });

    return () => socket.data.off('typingToClient');
  }, [dispatch, socket]);

  useEffect(() => {
    socket.data.on('doneTypingToClient', (data) => {
      dispatch({
        type: 'type/type',
        payload: {},
      });
    });

    return () => socket.data.off('doneTypingToClient');
  }, [dispatch, socket]);

  useEffect(() => {
    socket.data.emit('checkUserOnline', {});
  }, [socket, auth]);

  useEffect(() => {
    socket.data.on('checkUserOnlineToClient', (data) => {
      data.forEach((item) => {
        if (!status.includes(item.id) && item.id !== auth.user?._id) {
          dispatch({
            type: 'status/online',
            payload: item.id,
          });
        }
      });
    });

    return () => socket.data.off('checkUserOnlineToClient');
  }, [dispatch, status, socket, auth.user]);

  useEffect(() => {
    socket.data.on('checkUserOffline', (data) => {
      dispatch({
        type: 'status/offline',
        payload: data,
      });
    });

    return () => socket.data.off('checkUserOffline');
  }, [dispatch, socket]);

  useEffect(() => {
    socket.data.on('readMessageToClient', (data) => {
      dispatch({
        type: 'message/update_msg_read',
        payload: data,
      });

      dispatch({
        type: 'message/update_read_status',
        payload: data.conversation,
      });
    });

    return () => socket.data.off('readMessageToClient');
  }, [socket, dispatch]);

  return <div></div>;
};

export default SocketClient;
