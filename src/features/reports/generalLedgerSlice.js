import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for initial development
const mockGeneralLedgers = [];

const initialState = {
  generalLedgers: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchGeneralLedgers = createAsyncThunk(
  'generalLedger/fetchGeneralLedgers',
  async (filters, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/generalLedger/view`, {
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
      console.error('Error fetching general ledgers:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const exportGeneralLedgers = createAsyncThunk(
  'generalLedger/exportGeneralLedgers',
  async (filters) => {
    // TODO: Replace with actual API call
    return true;
  }
);

const generalLedgerSlice = createSlice({
  name: 'generalLedger',
  initialState,
  reducers: {
    resetGeneralLedgerState: (state) => {
      state.generalLedgers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch general ledgers
      .addCase(fetchGeneralLedgers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneralLedgers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalLedgers = action.payload;
      })
      .addCase(fetchGeneralLedgers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Export general ledgers
      .addCase(exportGeneralLedgers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportGeneralLedgers.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportGeneralLedgers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetGeneralLedgerState } = generalLedgerSlice.actions;

export default generalLedgerSlice.reducer;