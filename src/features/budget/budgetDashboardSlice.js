import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockBudgetDashboard = {
  chart1: {
    title: 'Budget vs Charges',
    data: [
      { name: 'Budget Amount', value: 500000 },
      { name: 'Charges', value: 300000 },
    ],
  },
  chart2: {
    title: 'PreEncumbrance, Encumbrance & Charges',
    data: [
      { name: 'PreEncumbrance', value: 100000 },
      { name: 'Encumbrance', value: 150000 },
      { name: 'Charges', value: 50000 },
    ],
  },
  table: [
    { label: 'Accounts Payable (AP)', total: 250000 },
    { label: 'Accounts Receivable (AR)', total: 180000 },
  ],
};


export const fetchBudgetData = createAsyncThunk(
  'budgetDashboard/fetchBudgetData',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/subFunds`, {
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

const budgetDashboardSlice = createSlice({
  name: 'budgetDashboard',
  initialState: {
    budgetData: {
      chart1: null,
      chart2: null,
      table: [],
    },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgetData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgetData = {
          chart1: action.payload.chart1,
          chart2: action.payload.chart2,
          table: Array.isArray(action.payload.table) ? action.payload.table : [],
        };
      })
      .addCase(fetchBudgetData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch budget data';
        console.warn('Failed to fetch budget data, using mock data.', state.error);
        state.budgetData = mockBudgetDashboard;
      })
      // .addCase(fetchBudgetData.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.error.message || 'Failed to fetch budget data';
      //   console.warn('Failed to fetch budget data, using mock data.', state.error);
      //   state.budgetData = mockBudgetDashboard;
      // });
      ;
  },
});

export const budgetDashboardReducer = budgetDashboardSlice.reducer;