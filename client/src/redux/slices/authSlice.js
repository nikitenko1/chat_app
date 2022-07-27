import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDataAPI, patchDataAPI, postDataAPI } from './../../utils/fetchData';
import { uploadFile } from './../../utils/imageHelper';
import jwt_decode from 'jwt-decode';

export const checkTokenExp = async (token, thunkAPI) => {
  const decoded = jwt_decode(token);
  if (decoded.exp >= Date.now() / 1000) return;

  const res = await getDataAPI('auth/refresh_token');
  thunkAPI.dispatch({
    type: 'auth',
    payload: {
      user: res.data.user,
      token: res.data.accessToken,
    },
  });

  return res.data.accessToken;
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('auth/register', userData);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (jobData, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('auth/login', jobData.userData);
      localStorage.setItem('inspace_authenticated', true);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      jobData.socket.data.connect();

      return {
        user: res.data.user,
        token: res.data.accessToken,
      };
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    try {
      const isAuthenticated = localStorage.getItem('inspace_authenticated');

      if (isAuthenticated) {
        const res = await getDataAPI('auth/refresh_token');

        return {
          user: res.data.user,
          token: res.data.accessToken,
        };
      }
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;

    try {
      const res = await getDataAPI('auth/logout', accessToken);
      localStorage.removeItem('inspace_authenticated');

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      jobData.socket.data.disconnect();

      return {};
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async (email, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('auth/register', { email });

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, thunkAPI) => {
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await postDataAPI('auth/reset_password', { token, password });

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      thunkAPI.dispatch({ type: 'alert/alert', payload: { loading: true } });

      const res = await patchDataAPI(
        'auth/change_password',
        jobData.passwordData,
        accessToken
      );

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

export const editProfile = createAsyncThunk(
  'auth/editProfile',
  async (jobData, thunkAPI) => {
    const tokenValidityResult = await checkTokenExp(jobData.token, thunkAPI);
    const accessToken = tokenValidityResult
      ? tokenValidityResult
      : jobData.token;
    try {
      let imgLink = '';
      if (jobData.avatar) {
        imgLink = await uploadFile([jobData.avatar], 'avatar');
      }

      const newData = {
        ...jobData.userData,
        avatar: jobData.avatar ? imgLink[0] : '',
      };

      const res = await patchDataAPI('auth/edit_profile', newData, accessToken);

      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { success: res.data.msg },
      });

      return {
        user: res.data.user,
        token: accessToken,
      };
    } catch (err) {
      thunkAPI.dispatch({
        type: 'alert/alert',
        payload: { error: err.response.data.msg },
      });
    }
  }
);

const initialState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => {
        return (
          action.type.startsWith('auth/') && action.type.endsWith('/fulfilled')
        );
      },
      (_, action) => {
        return action.payload;
      }
    );
  },
});

export default authSlice.reducer;
