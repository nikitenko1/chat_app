import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDataAPI, postDataAPI, patchDataAPI } from './../../utils/fetchData';
import { checkTokenExp } from './authSlice';

export const getMessages = createAsyncThunk(
  'message/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const res = await getDataAPI(`message/${jobData.id}`, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      thunkAPI.dispatch({
        type: 'message/get',
        payload: {
          data: res.data.messages.reverse(),
          result: res.data.result,
        },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const createMessage = createAsyncThunk(
  'message/create',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    jobData.socket.data.emit('createMessage', jobData.chatData);

    try {
      const newData = {
        ...jobData.chatData,
        sender: jobData.chatData.sender._id,
        recipient: jobData.chatData.recipient._id,
      };
      const res = await postDataAPI('message', newData, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      thunkAPI.dispatch({
        type: 'conversation/update',
        payload: jobData.chatData,
      });

      thunkAPI.dispatch({
        type: 'message/create',
        payload: jobData.chatData,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const updateReadStatus = createAsyncThunk(
  'message/update_read_status',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const res = await patchDataAPI(
        `message/update/${jobData.id}`,
        {},
        accessToken
      );

      thunkAPI.dispatch({
        type: 'message/update_read_status',
        payload: res.data.conversation,
      });

      jobData.socket.data.emit('readMessage', {
        recipient: jobData.id,
        sender: jobData.senderId,
        conversation: res.data.conversation,
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

const initialState = {
  data: [],
  result: 0,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    get: (state, action) => {
      return action.payload;
    },
    create: (state, action) => {
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    },
    clear: (state, action) => {
      return {
        data: [],
        result: 0,
      };
    },
    update_msg_read: (state, action) => {
      return {
        ...state,
        data: state.data.map((item) =>
          item.recipient._id === action.payload.sender &&
          item.sender._id === action.payload.recipient
            ? { ...item, isRead: true }
            : item
        ),
      };
    },
    load_more: (state, action) => {
      return {
        ...state,
        data: [...action.payload.messages.reverse(), ...state.data],
        result: state.result + action.payload.result,
      };
    },
    update_read_status: (state, action) => {
      return state.map((item) =>
        item._id === action.payload ? { ...item, totalUnread: 0 } : item
      );
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('message/') &&
          action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default messageSlice.reducer;
