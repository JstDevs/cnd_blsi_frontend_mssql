import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for initial development
const mockGeneralJournals = [
  {
    id: 1,
    date: '2024-03-20',
    reference: 'GJ-001',
    particulars: 'Monthly Rent Payment',
    accountCode: '1-01-01-010',
    debit: 50000.00,
    credit: 0.00,
    status: 'Posted',
    postedBy: 'John Smith',
    postedDate: '2024-03-20T10:30:00',
  },
  // Add more mock data as needed
];

const initialState = {
  generalJournals: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchGeneralJournals = createAsyncThunk(
  'generalJournal/fetchGeneralJournals',
  async (filters) => {
    // TODO: Replace with actual API call
    // For now, return mock data
    return [
      {
        id: 1,
        date: '2024-03-20',
        reference: 'GJ-2024-001',
        particulars: 'Monthly Rent',
        accountCode: '5010',
        debit: 50000.00,
        credit: 0.00,
        status: 'Posted',
        postedBy: 'John Doe',
        postedDate: '2024-03-20T10:00:00'
      },
      {
        id: 2,
        date: '2024-03-19',
        reference: 'GJ-2024-002',
        particulars: 'Utility Bills',
        accountCode: '5020',
        debit: 15000.00,
        credit: 0.00,
        status: 'Draft',
        postedBy: null,
        postedDate: null
      }
    ];
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