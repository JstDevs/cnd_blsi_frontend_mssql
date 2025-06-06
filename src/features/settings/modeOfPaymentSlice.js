import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockModeOfPayments = [
  { id: '1', code: 'CASH', name: 'Cash' },
  { id: '2', code: 'BANK_TRF', name: 'Bank Transfer' },
  { id: '3', code: 'CHEQUE', name: 'Cheque' },
];

// Async Thunks (Mock API calls)
export const fetchModeOfPayments = createAsyncThunk('modeOfPayments/fetchModeOfPayments', async () => {
  console.log('Mock API call: Fetching mode of payments');
  return new Promise(resolve => setTimeout(() => resolve(mockModeOfPayments), 500));
});

export const addModeOfPayment = createAsyncThunk('modeOfPayments/addModeOfPayment', async (modeOfPayment) => {
  console.log('Mock API call: Adding mode of payment', modeOfPayment);
  const newModeOfPayment = { ...modeOfPayment, id: Date.now().toString() }; // Assign a mock ID
  return new Promise(resolve => setTimeout(() => resolve(newModeOfPayment), 500));
});

export const updateModeOfPayment = createAsyncThunk('modeOfPayments/updateModeOfPayment', async (modeOfPayment) => {
  console.log('Mock API call: Updating mode of payment', modeOfPayment);
  return new Promise(resolve => setTimeout(() => resolve(modeOfPayment), 500));
});

export const deleteModeOfPayment = createAsyncThunk('modeOfPayments/deleteModeOfPayment', async (id) => {
  console.log('Mock API call: Deleting mode of payment with ID', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

const modeOfPaymentsSlice = createSlice({
  name: 'modeOfPayments',
  initialState: {
    modeOfPayments: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModeOfPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchModeOfPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modeOfPayments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchModeOfPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch mode of payments';
        console.warn('Failed to fetch mode of payments, using mock data.', state.error);
        state.modeOfPayments = mockModeOfPayments;
      })
      .addCase(addModeOfPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addModeOfPayment.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.modeOfPayments)) {
          state.modeOfPayments = [];
        }
        state.modeOfPayments.push(action.payload);
      })
      .addCase(addModeOfPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add mode of payment';
        console.error('Failed to add mode of payment:', state.error);
      })
      .addCase(updateModeOfPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateModeOfPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.modeOfPayments.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
           if (!Array.isArray(state.modeOfPayments)) {
             state.modeOfPayments = [];
          }
          state.modeOfPayments[index] = action.payload;
        }
      })
      .addCase(updateModeOfPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update mode of payment';
        console.error('Failed to update mode of payment:', state.error);
      })
      .addCase(deleteModeOfPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteModeOfPayment.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.modeOfPayments)) {
          state.modeOfPayments = [];
        }
        state.modeOfPayments = state.modeOfPayments.filter(item => item.id !== action.payload);
      })
      .addCase(deleteModeOfPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete mode of payment';
        console.error('Failed to delete mode of payment:', state.error);
      });
  },
});

export const modeOfPaymentsReducer = modeOfPaymentsSlice.reducer; 