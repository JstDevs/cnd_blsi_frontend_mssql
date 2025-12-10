import axiosInstance from '@/utils/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

// Async Thunks
export const fetchFunds = createAsyncThunk(
  'budgetFunds/fetchBudgetFunds',
  async () => {
    const response = await axiosInstance(`/funds`);
    return response.data;
  }
);

export const createBudgetFund = createAsyncThunk(
  'budgetFunds/createBudgetFund',
  async (values) => {
    const response = await fetch(`${API_URL}/funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ IsNew: true, ...values }),
    });
    const res = await response.json();
    if (res) {
      toast.success('Fund added successfully');
      return res;
    }
    throw new Error('Failed to create fund');
  }
);

export const updateBudgetFund = createAsyncThunk(
  'budgetFunds/updateBudgetFund',
  async (values) => {
    const response = await fetch(`${API_URL}/funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ IsNew: false, ...values }),
    });
    const res = await response.json();
    if (res) {
      toast.success('Fund updated successfully');
      return res;
    }
    throw new Error('Failed to update fund');
  }
);

export const deleteBudgetFund = createAsyncThunk(
  'budgetFunds/deleteBudgetFund',
  async (id) => {
    const response = await fetch(`${API_URL}/funds/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const res = await response.json();
    if (res) {
      toast.success('Fund deleted successfully');
      return id;
    }
    throw new Error('Failed to delete fund');
  }
);

const budgetFundsSlice = createSlice({
  name: 'budgetFunds',
  initialState: {
    funds: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFunds.fulfilled, (state, action) => {
        state.loading = false;
        state.funds = action.payload || [];
      })
      .addCase(fetchFunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to fetch budget funds');
      })
      .addCase(createBudgetFund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudgetFund.fulfilled, (state, action) => {
        state.loading = false;
        state.funds = [...state.funds, action.payload];
      })
      .addCase(createBudgetFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to create fund');
      })
      .addCase(updateBudgetFund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudgetFund.fulfilled, (state, action) => {
        state.loading = false;
        state.funds = state.funds.map((item) =>
          item.ID === action.payload.ID ? action.payload : item
        );
      })
      .addCase(updateBudgetFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to update fund');
      })
      .addCase(deleteBudgetFund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudgetFund.fulfilled, (state, action) => {
        state.loading = false;
        state.funds = state.funds.filter((item) => item.ID !== action.payload);
      })
      .addCase(deleteBudgetFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to delete fund');
      });
  },
});

export default budgetFundsSlice.reducer;
