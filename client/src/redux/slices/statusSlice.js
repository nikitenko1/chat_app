import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    online: (state, action) => {
      return [...state, action.payload];
    },
    offline: (state, action) => {
      return state.filter((item) => item !== action.payload);
    },
  },
});

export default statusSlice.reducer;
