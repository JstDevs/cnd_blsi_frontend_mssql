import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for initial development
const mockStatementComparisons = [];

const initialState = {
  statementComparisons: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchStatementComparisons = createAsyncThunk(
  'statementComparison/fetchStatementComparisons',
  async (filters, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/statementOfComparison/view`, {
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

export const exportStatementComparisons = createAsyncThunk(
  'statementComparison/exportStatementComparisons',
  async (filters) => {
    // TODO: Replace with actual API call
    return true;
  }
);

const statementComparisonSlice = createSlice({
  name: 'statementComparison',
  initialState,
  reducers: {
    resetStatementComparisonState: (state) => {
      state.statementComparisons = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch statement comparisons
      .addCase(fetchStatementComparisons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatementComparisons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statementComparisons = action.payload;
      })
      .addCase(fetchStatementComparisons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Export statement comparisons
      .addCase(exportStatementComparisons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportStatementComparisons.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportStatementComparisons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatementComparisonState } = statementComparisonSlice.actions;

export default statementComparisonSlice.reducer;