import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialAccounts = [
  {
    id: 1,
    accountCode: '1-01-01-010',
    accountTitle: 'Cash in Bank - Local Currency, Current Account',
    description: 'For recording cash in local bank current accounts',
    accountGroup: 'Cash and Cash Equivalents',
    normalBalance: 'Debit',
    isActive: true,
    allowDirectPosting: true,
    isContraAccount: false,
    openingBalance: 1000000,
    openingBalanceDate: '2024-01-01',
    slRequired: false,
  },
  {
    id: 2,
    accountCode: '1-01-02-020',
    accountTitle: 'Cash - Treasury/Collecting Officer',
    description: 'For recording cash with collecting officers',
    accountGroup: 'Cash and Cash Equivalents',
    normalBalance: 'Debit',
    isActive: true,
    allowDirectPosting: true,
    isContraAccount: false,
    openingBalance: 50000,
    openingBalanceDate: '2024-01-01',
    slRequired: false,
  },
  // Add more mock accounts as needed
];

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
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialAccounts);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addAccount = createAsyncThunk(
  'chartOfAccounts/addAccount',
  async (account, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newAccount = {
            ...account,
            id: Date.now(),
          };
          resolve(newAccount);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateAccount = createAsyncThunk(
  'chartOfAccounts/updateAccount',
  async (account, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(account);
        }, 500);
      });
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
          (account) => account.id === action.payload.id
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setAccount, resetAccountState } = chartOfAccountsSlice.actions;
export default chartOfAccountsSlice.reducer;