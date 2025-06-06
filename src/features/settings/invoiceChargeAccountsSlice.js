import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for development
const mockData = [
  {
    id: 1,
    marriageServiceInvoice: 'Account 1',
    burialServiceInvoice: 'Account 2',
    dueFromLGU: 'Account 3',
    dueFromRate: 0.4,
    dueToLGU: 'Account 4',
    dueToRate: 0.6,
    specialEducationFund: 'Account 5',
    specialEducationRate: 0.1,
    status: 'Active'
  }
];

// Mock account options
export const accountOptions = [
  { value: 'Account 1', label: 'Account 1' },
  { value: 'Account 2', label: 'Account 2' },
  { value: 'Account 3', label: 'Account 3' },
  { value: 'Account 4', label: 'Account 4' },
  { value: 'Account 5', label: 'Account 5' },
];

// Async thunks
export const fetchInvoiceChargeAccounts = createAsyncThunk(
  'invoiceChargeAccounts/fetchInvoiceChargeAccounts',
  async () => {
    try {
      // Replace with actual API call
      // const response = await api.get('/api/invoice-charge-accounts');
      // return response.data;
      return mockData;
    } catch (error) {
      console.warn('Failed to fetch invoice charge accounts:', error);
      return mockData;
    }
  }
);

export const addInvoiceChargeAccount = createAsyncThunk(
  'invoiceChargeAccounts/addInvoiceChargeAccount',
  async (data) => {
    try {
      // Replace with actual API call
      // const response = await api.post('/api/invoice-charge-accounts', data);
      // return response.data;
      return { ...data, id: Date.now(), status: 'Active' };
    } catch (error) {
      console.warn('Failed to add invoice charge account:', error);
      throw error;
    }
  }
);

export const updateInvoiceChargeAccount = createAsyncThunk(
  'invoiceChargeAccounts/updateInvoiceChargeAccount',
  async (data) => {
    try {
      // Replace with actual API call
      // const response = await api.put(`/api/invoice-charge-accounts/${data.id}`, data);
      // return response.data;
      return data;
    } catch (error) {
      console.warn('Failed to update invoice charge account:', error);
      throw error;
    }
  }
);

export const deleteInvoiceChargeAccount = createAsyncThunk(
  'invoiceChargeAccounts/deleteInvoiceChargeAccount',
  async (id) => {
    try {
      // Replace with actual API call
      // await api.delete(`/api/invoice-charge-accounts/${id}`);
      return id;
    } catch (error) {
      console.warn('Failed to delete invoice charge account:', error);
      throw error;
    }
  }
);

const initialState = {
  invoiceChargeAccounts: [],
  isLoading: false,
  error: null
};

const invoiceChargeAccountsSlice = createSlice({
  name: 'invoiceChargeAccounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchInvoiceChargeAccounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceChargeAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoiceChargeAccounts = action.payload;
      })
      .addCase(fetchInvoiceChargeAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Add
      .addCase(addInvoiceChargeAccount.fulfilled, (state, action) => {
        state.invoiceChargeAccounts.push(action.payload);
      })
      // Update
      .addCase(updateInvoiceChargeAccount.fulfilled, (state, action) => {
        const index = state.invoiceChargeAccounts.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.invoiceChargeAccounts[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteInvoiceChargeAccount.fulfilled, (state, action) => {
        state.invoiceChargeAccounts = state.invoiceChargeAccounts.filter(item => item.id !== action.payload);
      });
  }
});

export default invoiceChargeAccountsSlice.reducer; 