import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import alert from './slices/alertSlice';
import conversation from './slices/conversationSlice';
import message from './slices/messageSlice';
import socket from './slices/socketSlice';
import status from './slices/statusSlice';
import typing from './slices/typeSlice';

const rootReducer = combineReducers({
  auth,
  alert,
  conversation,
  message,
  socket,
  status,
  typing,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const DataProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default DataProvider;
