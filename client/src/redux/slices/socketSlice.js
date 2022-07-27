import { createSlice } from '@reduxjs/toolkit';

const initialState = { data: [] };

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    init: (state, action) => {
      return { ...state, data: action.payload };
    },
  },
});
export const { init } = socketSlice.actions;
export default socketSlice.reducer;
