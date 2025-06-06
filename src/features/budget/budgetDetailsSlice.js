import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockBudgetDetails = [
  { id: '1', code: 'BD001', name: 'General Fund', year: '2024', amount: 1000000 },
  { id: '2', code: 'BD002', name: 'Special Education Fund', year: '2024', amount: 500000 },
  { id: '3', code: 'BD003', name: 'Development Fund', year: '2024', amount: 750000 },
];

// Async Thunks
export const fetchBudgetDetails = createAsyncThunk('budgetDetails/fetchBudgetDetails', async () => {
  console.log('Mock API call: Fetching budget details');
  return new Promise(resolve => setTimeout(() => resolve(mockBudgetDetails), 500));
});

export const addBudgetDetail = createAsyncThunk('budgetDetails/addBudgetDetail', async (budgetDetail) => {
  console.log('Mock API call: Adding budget detail', budgetDetail);
  const newBudgetDetail = { ...budgetDetail, id: Date.now().toString() };
  return new Promise(resolve => setTimeout(() => resolve(newBudgetDetail), 500));
});

export const updateBudgetDetail = createAsyncThunk('budgetDetails/updateBudgetDetail', async (budgetDetail) => {
  console.log('Mock API call: Updating budget detail', budgetDetail);
  return new Promise(resolve => setTimeout(() => resolve(budgetDetail), 500));
});

export const deleteBudgetDetail = createAsyncThunk('budgetDetails/deleteBudgetDetail', async (id) => {
  console.log('Mock API call: Deleting budget detail', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

const budgetDetailsSlice = createSlice({
  name: 'budgetDetails',
  initialState: {
    budgetDetails: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgetDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgetDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgetDetails = action.payload;
      })
      .addCase(fetchBudgetDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.warn('Failed to fetch budget details, using mock data');
        state.budgetDetails = mockBudgetDetails;
      })
      .addCase(addBudgetDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBudgetDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgetDetails.push(action.payload);
      })
      .addCase(addBudgetDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateBudgetDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBudgetDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.budgetDetails.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.budgetDetails[index] = action.payload;
        }
      })
      .addCase(updateBudgetDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBudgetDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBudgetDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgetDetails = state.budgetDetails.filter(item => item.id !== action.payload);
      })
      .addCase(deleteBudgetDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const budgetDetailsReducer = budgetDetailsSlice.reducer; 