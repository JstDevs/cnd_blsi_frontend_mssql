import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockFiscalYears = [
  { id: 'fy1', startDate: '2023-01-01', endDate: '2023-12-31' },
  { id: 'fy2', startDate: '2024-01-01', endDate: '2024-12-31' },
];

// Async Thunks (Mock API calls)
export const fetchFiscalYears = createAsyncThunk('fiscalYears/fetchFiscalYears', async () => {
  console.log('Mock API call: Fetching fiscal years');
  return new Promise(resolve => setTimeout(() => resolve(mockFiscalYears), 500));
});

export const addFiscalYear = createAsyncThunk('fiscalYears/addFiscalYear', async (fiscalYear) => {
  console.log('Mock API call: Adding fiscal year', fiscalYear);
  const newFiscalYear = { ...fiscalYear, id: Date.now().toString() }; // Assign a mock ID
  return new Promise(resolve => setTimeout(() => resolve(newFiscalYear), 500));
});

export const updateFiscalYear = createAsyncThunk('fiscalYears/updateFiscalYear', async (fiscalYear) => {
  console.log('Mock API call: Updating fiscal year', fiscalYear);
  return new Promise(resolve => setTimeout(() => resolve(fiscalYear), 500));
});

export const deleteFiscalYear = createAsyncThunk('fiscalYears/deleteFiscalYear', async (id) => {
  console.log('Mock API call: Deleting fiscal year with ID', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

const fiscalYearsSlice = createSlice({
  name: 'fiscalYears',
  initialState: {
    fiscalYears: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiscalYears.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFiscalYears.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fiscalYears = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFiscalYears.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch fiscal years';
        console.warn('Failed to fetch fiscal years, using mock data.', state.error);
        state.fiscalYears = mockFiscalYears;
      })
      .addCase(addFiscalYear.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFiscalYear.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.fiscalYears)) {
          state.fiscalYears = [];
        }
        state.fiscalYears.push(action.payload);
      })
      .addCase(addFiscalYear.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add fiscal year';
        console.error('Failed to add fiscal year:', state.error);
      })
      .addCase(updateFiscalYear.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFiscalYear.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.fiscalYears.findIndex(year => year.id === action.payload.id);
        if (index !== -1) {
           if (!Array.isArray(state.fiscalYears)) {
             state.fiscalYears = [];
          }
          state.fiscalYears[index] = action.payload;
        }
      })
      .addCase(updateFiscalYear.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update fiscal year';
        console.error('Failed to update fiscal year:', state.error);
      })
      .addCase(deleteFiscalYear.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFiscalYear.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.fiscalYears)) {
          state.fiscalYears = [];
        }
        state.fiscalYears = state.fiscalYears.filter(year => year.id !== action.payload);
      })
      .addCase(deleteFiscalYear.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete fiscal year';
        console.error('Failed to delete fiscal year:', state.error);
      });
  },
});

export const fiscalYearsReducer = fiscalYearsSlice.reducer; 