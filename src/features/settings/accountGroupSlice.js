import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialAccountGroups = [];

const initialState = {
  accountGroups: initialAccountGroups,
  accountGroup: null,
  isLoading: false,
  error: null,
};

export const fetchAccountGroups = createAsyncThunk(
  'accountGroups/fetchAccountGroups',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/accountType`, {
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

export const addAccountGroup = createAsyncThunk(
  'accountGroups/addAccountGroup',
  async (accountGroup, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/accountType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(accountGroup),
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


export const updateAccountGroup = createAsyncThunk(
  'accountGroups/updateAccountGroup',
  async (accountGroup, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/accountType/${accountGroup.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(accountGroup),
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

export const deleteAccountGroup = createAsyncThunk(
  'accountGroups/deleteAccountGroup',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/accountType/${ID}`, {
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

const accountGroupSlice = createSlice({
  name: 'accountGroups',
  initialState,
  reducers: {
    setAccountGroup: (state, action) => {
      state.accountGroup = action.payload;
    },
    resetAccountGroupState: (state) => {
      state.accountGroup = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch account groups
      .addCase(fetchAccountGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAccountGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountGroups = action.payload;
        state.error = null;
      })
      .addCase(fetchAccountGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add account group
      .addCase(addAccountGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAccountGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountGroups.push(action.payload);
        state.error = null;
      })
      .addCase(addAccountGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update account group
      .addCase(updateAccountGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAccountGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.accountGroups.findIndex(
          (accountGroup) => accountGroup.ID === action.payload.ID
        );
        if (index !== -1) {
          state.accountGroups[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAccountGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete account group
      .addCase(deleteAccountGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAccountGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountGroups = state.accountGroups.filter(
          (accountGroup) => accountGroup.ID !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteAccountGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setAccountGroup, resetAccountGroupState } = accountGroupSlice.actions;

export default accountGroupSlice.reducer;