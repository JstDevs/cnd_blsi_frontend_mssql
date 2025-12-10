import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  selectedRole: null, // Add selectedRole to initial state
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const user = await authService.login(username, password);
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authService.logout();
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      const response = await authService.changePassword(
        currentPassword,
        newPassword
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (token, thunkAPI) => {
    try {
      const user = await authService.fetchUserProfile(token);
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// Add a new action to update the selected role
export const updateSelectedRole = createAsyncThunk(
  'auth/updateSelectedRole',
  async (role, thunkAPI) => {
    try {
      // Save to localStorage
      localStorage.setItem('selectedRole', JSON.stringify(role));
      return role;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        // Set initial selected role on login
        if (action.payload.accessList?.length > 0) {
          const defaultRole =
            action.payload.accessList.length >= 2
              ? action.payload.accessList[1]
              : action.payload.accessList[0];
          state.selectedRole = defaultRole;
          localStorage.setItem('selectedRole', JSON.stringify(defaultRole));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.selectedRole = null; // Clear selected role on logout
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        // Try to get selected role from localStorage or set default
        const storedRole = localStorage.getItem('selectedRole');
        if (storedRole) {
          state.selectedRole = JSON.parse(storedRole);
        } else if (action.payload.accessList?.length > 0) {
          const defaultRole =
            action.payload.accessList.length >= 2
              ? action.payload.accessList[1]
              : action.payload.accessList[0];
          state.selectedRole = defaultRole;
        }
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateSelectedRole.fulfilled, (state, action) => {
        state.selectedRole = action.payload;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
