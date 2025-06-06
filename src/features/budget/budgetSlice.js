import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async () => {
    // Simulate API call
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: 1,
              budgetName: '2024 Operating Budget',
              fiscalYear: '2024',
              department: 'Department 1',
              subDepartment: 'Sub-Department 1',
              chartOfAccounts: 'Chart of Accounts 1',
              fund: 'General Fund',
              project: 'Project 1',
              appropriation: 1000000,
              charges: 500000,
              totalAmount: 1500000,
              balance: 1000000,
              status: 'active',
            },
            {
              id: 2,
              budgetName: '2024 Capital Budget',
              fiscalYear: '2024',
              department: 'Department 2',
              subDepartment: 'Sub-Department 2',
              chartOfAccounts: 'Chart of Accounts 2',
              fund: 'General Fund',
              project: 'Project 2',
              appropriation: 2000000,
              charges: 1000000,
              totalAmount: 3000000,
              balance: 2000000,
              status: 'active',
            },
          ],
        });
      }, 1000);
    });
    return response.data;
  }
);

export const createBudget = createAsyncThunk(
  'budget/createBudget',
  async (budgetData) => {
    // Simulate API call
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: Date.now(),
            ...budgetData,
            status: 'active',
          },
        });
      }, 1000);
    });
    return response.data;
  }
);

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  async ({ id, budgetData }) => {
    // Simulate API call
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id,
            ...budgetData,
          },
        });
      }, 1000);
    });
    return response.data;
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/deleteBudget',
  async (id) => {
    // Simulate API call
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    return id;
  }
);

const initialState = {
  budgets: [],
  isLoading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Create budget
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets.push(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Update budget
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.budgets.findIndex((budget) => budget.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Delete budget
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = state.budgets.filter((budget) => budget.id !== action.payload);
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default budgetSlice.reducer; 