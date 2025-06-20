import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockPaymentTerms = [];
export const fetchPaymentTerms = createAsyncThunk(
  'paymentTerms/fetchPaymentTerms',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/paymentTerms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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


export const addPaymentTerm = createAsyncThunk(
  'paymentTerms/addPaymentTerm',
  async (paymentTerm, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/paymentTerms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(paymentTerm),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePaymentTerm = createAsyncThunk(
  'paymentTerms/updatePaymentTerm',
  async (paymentTerm, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/paymentTerms/${paymentTerm.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(paymentTerm),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deletePaymentTerm = createAsyncThunk(
  'paymentTerms/deletePaymentTerm',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/paymentTerms/${ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete');
      }

      return ID; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

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
        const index = state.paymentTerms.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.paymentTerms)) {
            state.paymentTerms = [];
          }
          state.paymentTerms[index] = action.payload;
        }
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
        state.paymentTerms = state.paymentTerms.filter(item => item.ID !== action.payload);
      })
      .addCase(deletePaymentTerm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete payment term';
        console.error('Failed to delete payment term:', state.error);
      });
  },
});

export const paymentTermsReducer = paymentTermsSlice.reducer;