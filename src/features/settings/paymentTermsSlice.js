import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockPaymentTerms = [
  { id: '1', code: 'NET30', name: 'Net 30 Days', numberOfDays: 30 },
  { id: '2', code: 'DUEONRECEIPT', name: 'Due on Receipt', numberOfDays: 0 },
  { id: '3', code: 'NET60', name: 'Net 60 Days', numberOfDays: 60 },
];

// Async Thunks (Mock API calls)
export const fetchPaymentTerms = createAsyncThunk('paymentTerms/fetchPaymentTerms', async () => {
  console.log('Mock API call: Fetching payment terms');
  return new Promise(resolve => setTimeout(() => resolve(mockPaymentTerms), 500));
});

export const addPaymentTerm = createAsyncThunk('paymentTerms/addPaymentTerm', async (paymentTerm) => {
  console.log('Mock API call: Adding payment term', paymentTerm);
  const newPaymentTerm = { ...paymentTerm, id: Date.now().toString() }; // Assign a mock ID
  return new Promise(resolve => setTimeout(() => resolve(newPaymentTerm), 500));
});

export const updatePaymentTerm = createAsyncThunk('paymentTerms/updatePaymentTerm', async (paymentTerm) => {
  console.log('Mock API call: Updating payment term', paymentTerm);
  return new Promise(resolve => setTimeout(() => resolve(paymentTerm), 500));
});

export const deletePaymentTerm = createAsyncThunk('paymentTerms/deletePaymentTerm', async (id) => {
  console.log('Mock API call: Deleting payment term with ID', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

const paymentTermsSlice = createSlice({
  name: 'paymentTerms',
  initialState: {
    paymentTerms: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentTerms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentTerms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentTerms = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPaymentTerms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch payment terms';
        console.warn('Failed to fetch payment terms, using mock data.', state.error);
        state.paymentTerms = mockPaymentTerms;
      })
      .addCase(addPaymentTerm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPaymentTerm.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.paymentTerms)) {
          state.paymentTerms = [];
        }
        state.paymentTerms.push(action.payload);
      })
      .addCase(addPaymentTerm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add payment term';
        console.error('Failed to add payment term:', state.error);
      })
      .addCase(updatePaymentTerm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentTerm.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.paymentTerms.findIndex(term => term.id === action.payload.id);
        if (index !== -1) {
           if (!Array.isArray(state.paymentTerms)) {
             state.paymentTerms = [];
          }
          state.paymentTerms[index] = action.payload;
        }
      })
      .addCase(updatePaymentTerm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update payment term';
        console.error('Failed to update payment term:', state.error);
      })
      .addCase(deletePaymentTerm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePaymentTerm.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.paymentTerms)) {
          state.paymentTerms = [];
        }
        state.paymentTerms = state.paymentTerms.filter(term => term.id !== action.payload);
      })
      .addCase(deletePaymentTerm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete payment term';
        console.error('Failed to delete payment term:', state.error);
      });
  },
});

export const paymentTermsReducer = paymentTermsSlice.reducer; 