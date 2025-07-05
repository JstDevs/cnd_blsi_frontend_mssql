import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for initial development
const mockFinancialStatements = [];

const initialState = {
  financialStatements: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchFinancialStatements = createAsyncThunk(
  'financialStatement/fetchFinancialStatements',
  async (filters, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/financialStatementsReports/view`, {
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
      console.error('Error fetching financial statements:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const exportFinancialStatements = createAsyncThunk(
  'financialStatement/exportFinancialStatements',
  async (filters) => {
    // TODO: Replace with actual API call
    return true;
  }
);

const financialStatementSlice = createSlice({
  name: 'financialStatement',
  initialState,
  reducers: {
    resetFinancialStatementState: (state) => {
      state.financialStatements = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch financial statements
      .addCase(fetchFinancialStatements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFinancialStatements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.financialStatements = action.payload;
      })
      .addCase(fetchFinancialStatements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Export financial statements
      .addCase(exportFinancialStatements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportFinancialStatements.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportFinancialStatements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetFinancialStatementState } = financialStatementSlice.actions;

export default financialStatementSlice.reducer;