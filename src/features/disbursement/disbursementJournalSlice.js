import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for initial development
const mockDisbursementJournals = []

const initialState = {
  disbursementJournals: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchDisbursementJournals = createAsyncThunk(
  'disbursementJournal/fetchJournals',
  async (filters, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/disbursementJournals/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filters),
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

export const exportDisbursementJournals = createAsyncThunk(
  'disbursementJournal/exportJournals',
  async (filters) => {
    // TODO: Replace with actual API call
    console.log('Exporting journals with filters:', filters);
    return true;
  }
);

const disbursementJournalSlice = createSlice({
  name: 'disbursementJournal',
  initialState,
  reducers: {
    resetDisbursementJournalState: (state) => {
      state.disbursementJournals = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Journals
      .addCase(fetchDisbursementJournals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDisbursementJournals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.disbursementJournals = action.payload;
      })
      .addCase(fetchDisbursementJournals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Export Journals
      .addCase(exportDisbursementJournals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportDisbursementJournals.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportDisbursementJournals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetDisbursementJournalState } = disbursementJournalSlice.actions;

export default disbursementJournalSlice.reducer; 