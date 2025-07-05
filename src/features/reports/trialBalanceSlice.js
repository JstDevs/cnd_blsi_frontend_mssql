import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for initial development
const mockTrialBalances = [];

const initialState = {
  trialBalances: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTrialBalances = createAsyncThunk(
  'trialBalance/fetchTrialBalances',
  async (filters, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/trialBalanceReport/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filters),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to fetch');
      }

      return res;
    } catch (error) {
      console.error('Error fetching trial balance:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const exportTrialBalances = createAsyncThunk(
  'trialBalance/exportTrialBalances',
  async (filters) => {
    // TODO: Replace with actual API call
    return true;
  }
);

const trialBalanceSlice = createSlice({
  name: 'trialBalance',
  initialState,
  reducers: {
    resetTrialBalanceState: (state) => {
      state.trialBalances = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trial balances
      .addCase(fetchTrialBalances.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrialBalances.fulfilled, (state, action) => {
        state.isLoading = false;
        state.trialBalances = action.payload;
      })
      .addCase(fetchTrialBalances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Export trial balances
      .addCase(exportTrialBalances.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportTrialBalances.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportTrialBalances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetTrialBalanceState } = trialBalanceSlice.actions;

export default trialBalanceSlice.reducer;