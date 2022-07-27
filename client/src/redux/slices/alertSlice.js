import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    alert: (state, action) => {
      return action.payload;
    },
  },
});

export default alertSlice.reducer;
