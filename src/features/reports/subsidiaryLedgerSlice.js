import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for initial development
const mockSubsidiaryLedgers = [];

const initialState = {
  subsidiaryLedgers: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchSubsidiaryLedgers = createAsyncThunk(
  'subsidiaryLedger/fetchSubsidiaryLedgers',
  async (filters, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/subsidiaryLeadger/view`, {
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
      console.error('Error fetching subsidiary ledger:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const exportSubsidiaryLedgers = createAsyncThunk(
  'subsidiaryLedger/exportSubsidiaryLedgers',
  async (filters) => {
    // TODO: Replace with actual API call
    return true;
  }
);

const subsidiaryLedgerSlice = createSlice({
  name: 'subsidiaryLedger',
  initialState,
  reducers: {
    resetSubsidiaryLedgerState: (state) => {
      state.subsidiaryLedgers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subsidiary ledgers
      .addCase(fetchSubsidiaryLedgers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubsidiaryLedgers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subsidiaryLedgers = action.payload;
      })
      .addCase(fetchSubsidiaryLedgers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Export subsidiary ledgers
      .addCase(exportSubsidiaryLedgers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportSubsidiaryLedgers.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportSubsidiaryLedgers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetSubsidiaryLedgerState } = subsidiaryLedgerSlice.actions;

export default subsidiaryLedgerSlice.reducer;