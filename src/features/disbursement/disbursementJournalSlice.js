import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for initial development
const mockDisbursementJournals = [
  {
    id: 1,
    municipality: 'Sample Municipality',
    funds: 'General Fund',
    date: '2024-03-20',
    checkNo: 'CHK-001',
    voucherNo: 'DV-001',
    jevNo: 'JEV-001',
    claimant: 'John Doe',
    particulars: 'Office Supplies',
    accountCode: '1-01-01-010',
    debit: 5000.00,
    credit: 0.00,
    approver: 'Jane Smith',
    position: 'Department Head',
    startDate: '2024-03-01',
    endDate: '2024-03-31'
  },
  // Add more mock data as needed
];

const initialState = {
  disbursementJournals: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchDisbursementJournals = createAsyncThunk(
  'disbursementJournal/fetchJournals',
  async (filters) => {
    // TODO: Replace with actual API call
    // Mock data for demonstration
    return [
      {
        id: 1,
        municipality: 'Sample Municipality',
        funds: 'General Fund',
        date: '2024-03-20',
        checkNo: 'CHK-001',
        voucherNo: 'DV-001',
        jevNo: 'JEV-001',
        claimant: 'John Doe',
        particulars: 'Office Supplies',
        accountCode: '1-01-01-010',
        debit: 5000,
        credit: 0,
        approver: 'Jane Smith',
        position: 'Department Head',
        startDate: '2024-03-01',
        endDate: '2024-03-31',
      },
      {
        id: 2,
        municipality: 'Sample Municipality',
        funds: 'Special Fund',
        date: '2024-03-21',
        checkNo: 'CHK-002',
        voucherNo: 'DV-002',
        jevNo: 'JEV-002',
        claimant: 'Alice Johnson',
        particulars: 'Equipment Purchase',
        accountCode: '1-01-02-020',
        debit: 15000,
        credit: 0,
        approver: 'Bob Wilson',
        position: 'Department Head',
        startDate: '2024-03-01',
        endDate: '2024-03-31',
      },
    ];
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