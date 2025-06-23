import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialAccounts = [];

const initialState = {
  accounts: initialAccounts,
  account: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchAccounts = createAsyncThunk(
  'chartOfAccounts/fetchAccounts',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/chartofAccounts`, {
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

export const addAccount = createAsyncThunk(
  'chartOfAccounts/addAccount',
  async (account, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/chartofAccounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(account),
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

export const updateAccount = createAsyncThunk(
  'chartOfAccounts/updateAccount',
  async (account, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/chartofAccounts/${account.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(account),
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

export const deleteAccount = createAsyncThunk(
  'chartOfAccounts/deleteAccount',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/chartofAccounts/${ID}`, {
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

const chartOfAccountsSlice = createSlice({
  name: 'chartOfAccounts',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    resetAccountState: (state) => {
      state.account = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts = action.payload;
        state.error = null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add account
      .addCase(addAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts.push(action.payload);
        state.error = null;
      })
      .addCase(addAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update account
      .addCase(updateAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.accounts.findIndex(
          (account) => account.ID === action.payload.ID
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.accounts)) {
          state.accounts = [];
        }
        state.accounts = state.accounts.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete account';
        console.error('Failed to delete account:', state.error);
      });
  },
});

export const { setAccount, resetAccountState } = chartOfAccountsSlice.actions;
export default chartOfAccountsSlice.reducer;