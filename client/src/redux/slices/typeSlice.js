import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const typeSlice = createSlice({
  name: 'type',
  initialState,
  reducers: {
    type: (state, action) => {
      return action.payload;
    },
  },
});

export default typeSlice.reducer;
