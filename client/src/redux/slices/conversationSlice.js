import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDataAPI } from '../../utils/fetchData';
import { checkTokenExp } from './authSlice';

export const getConversation = createAsyncThunk(
  'conversation/get',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;  

    try {
      const res = await getDataAPI('message/conversation', accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      return res.data.conversation;
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

const conversationSlice = createSlice({
  name: 'conversation',
  initialState: [],

  reducers: {
    get: (state, action) => {
      // return { ...state,  action.payload };
      return action.payload;
    },
    update: (state, action) => {
      // const messageSchema = new mongoose.Schema(
      //   {
      //     conversation: { type: mongoose.Types.ObjectId, ref: 'conversation' },
      //     sender: { type: mongoose.Types.ObjectId, ref: 'user' },
      //     recipient: { type: mongoose.Types.ObjectId, ref: 'user' },
      const conversationData = state.find(
        (item) =>
          (item.recipients[0]._id === action.payload.sender._id &&
            item.recipients[1]._id === action.payload.recipient._id) ||
          (item.recipients[0]._id === action.payload.recipient._id &&
            item.recipients[1]._id === action.payload.sender._id)
      );
      // const conversationSchema = new mongoose.Schema(
      //   {
      //     recipients: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
      //     text: String,
      //     media: Array,
      //     audio: String,
      //     files: Array,
      //     call: Object,
      //     totalUnread: { type: Number, default: 0 },
      const newConversationData = {
        ...conversationData,
        recipients: [action.payload.sender, action.payload.recipient],
        text: action.payload.text,
        media: action.payload.media,
        audio: action.payload.audio,
        files: action.payload.files,
        call: action.payload.call,
        totalUnread: conversationData.totalUnread + 1,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
      };
      const tempState = state.filter(
        (item) => item._id !== newConversationData._id
      );
      return [newConversationData, ...tempState];
    },
    add: (state, action) => {
      const conversationAvailable = state.find(
        (item) =>
          item.recipients[0]._id === action.payload.recipientId ||
          item.recipients[1]._id === action.payload.recipientId
      );

      if (!conversationAvailable) {
        const data = {
          media: action.payload.media ? action.payload.media : [],
          text: action.payload.text ? action.payload.text : '',
          audio: action.payload.audio ? action.paylaod.audio : '',
          files: action.payload.files ? action.payload.files : [],
          call: action.payload.call ? action.payload.call : {},
          createdAt: action.payload.createdAt ? action.payload.createdAt : '',
          updatedAt: action.payload.updatedAt ? action.payload.updatedAt : '',
          recipients: [
            {
              _id: action.payload.senderId,
              name: action.payload.senderName,
              avatar: action.payload.senderAvatar,
            },
            {
              _id: action.payload.recipientId,
              name: action.payload.recipientName,
              avatar: action.payload.recipientAvatar,
            },
          ],
        };
        return [data, ...state];
      }
      return state;
    },
  },
});

export default conversationSlice.reducer;
