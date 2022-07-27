import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Alert from './components/global/Alert';
import PageRender from './utils/PageRender';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import io from 'socket.io-client';
import { refreshToken } from './redux/slices/authSlice';
import SocketClient from './SocketClient';

const App = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());

    const socket = io('http://localhost:5000');

    dispatch({ type: 'socket/init', payload: socket });
    return () => socket.close();
  }, [dispatch, auth.token]);

  useEffect(() => {
    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      return dispatch({
        type: 'alert/alert',
        payload: {
          error: 'This browser does not support desktop notification',
        },
      });
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
        }
      });
    }
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }, [dispatch]);

  return (
    <Router>
      <Alert />
      {auth.token && <SocketClient />}
      <Routes>
        <Route path="/" element={auth.user ? <Dashboard /> : <Login />} />
        <Route path="/:page" element={<PageRender />} />
        <Route path="/:page/:id" element={<PageRender />} />
      </Routes>
    </Router>
  );
};

export default App;
