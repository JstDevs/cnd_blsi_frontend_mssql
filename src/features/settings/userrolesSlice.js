import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockUserroles = [];
export const fetchUserroles = createAsyncThunk(
  'userroles/fetchUserroles',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/userAccess`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const addUserrole = createAsyncThunk(
  'userroles/addUserrole',
  async (userrole, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/userAccess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userrole),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUserrole = createAsyncThunk(
  'userroles/updateUserrole',
  async (userrole, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/userAccess/${userrole.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userrole),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteUserrole = createAsyncThunk(
  'userroles/deleteUserrole',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/userAccess/${ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete');
      }

      return ID; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userrolesSlice = createSlice({
  name: 'userroles',
  initialState: {
    userroles: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserroles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserroles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userroles = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserroles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user roles';
        console.warn('Failed to fetch user roles, using mock data.', state.error);
        state.userroles = mockUserroles;
      })
      .addCase(addUserrole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUserrole.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.userroles)) {
          state.userroles = [];
        }
        state.userroles.push(action.payload);
      })
      .addCase(addUserrole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add user role';
        console.error('Failed to add user role:', state.error);
      })
      .addCase(updateUserrole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserrole.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.userroles.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
           if (!Array.isArray(state.userroles)) {
             state.userroles = [];
          }
          state.userroles[index] = action.payload;
        }
      })
      .addCase(deleteUserrole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserrole.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.userroles)) {
          state.userroles = [];
        }
        state.userroles = state.userroles.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteUserrole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete user role';
        console.error('Failed to delete user role:', state.error);
      });
  },
});

export const userrolesReducer = userrolesSlice.reducer;