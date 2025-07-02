import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for initial development
const mockGeneralJournals = [];

const initialState = {
  generalJournals: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchGeneralJournals = createAsyncThunk(
  'generalJournal/fetchGeneralJournals',
  async (filters, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/generalJournal/view`, {
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
      console.error('Error fetching general journals:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const exportGeneralJournals = createAsyncThunk(
  'generalJournal/exportGeneralJournals',
  async (filters) => {
    // TODO: Replace with actual API call
    return true;
  }
);

const generalJournalSlice = createSlice({
  name: 'generalJournal',
  initialState,
  reducers: {
    resetGeneralJournalState: (state) => {
      state.generalJournals = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch general journals
      .addCase(fetchGeneralJournals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneralJournals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalJournals = action.payload;
      })
      .addCase(fetchGeneralJournals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Export general journals
      .addCase(exportGeneralJournals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportGeneralJournals.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exportGeneralJournals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetGeneralJournalState } = generalJournalSlice.actions;

export default generalJournalSlice.reducer; 