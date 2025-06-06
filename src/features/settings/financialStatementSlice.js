import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockFinancialStatements = [
  { id: '1', code: 'BS', name: 'Balance Sheet' },
  { id: '2', code: 'IS', name: 'Income Statement' },
  { id: '3', code: 'CF', name: 'Cash Flow Statement' },
];

// Async Thunks (Mock API calls)
export const fetchFinancialStatements = createAsyncThunk('financialStatements/fetchFinancialStatements', async () => {
  console.log('Mock API call: Fetching financial statements');
  return new Promise(resolve => setTimeout(() => resolve(mockFinancialStatements), 500));
});

export const addFinancialStatement = createAsyncThunk('financialStatements/addFinancialStatement', async (financialStatement) => {
  console.log('Mock API call: Adding financial statement', financialStatement);
  const newFinancialStatement = { ...financialStatement, id: Date.now().toString() }; // Assign a mock ID
  return new Promise(resolve => setTimeout(() => resolve(newFinancialStatement), 500));
});

export const updateFinancialStatement = createAsyncThunk('financialStatements/updateFinancialStatement', async (financialStatement) => {
  console.log('Mock API call: Updating financial statement', financialStatement);
  return new Promise(resolve => setTimeout(() => resolve(financialStatement), 500));
});

export const deleteFinancialStatement = createAsyncThunk('financialStatements/deleteFinancialStatement', async (id) => {
  console.log('Mock API call: Deleting financial statement with ID', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

const financialStatementsSlice = createSlice({
  name: 'financialStatements',
  initialState: {
    financialStatements: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialStatements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFinancialStatements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.financialStatements = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFinancialStatements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch financial statements';
        console.warn('Failed to fetch financial statements, using mock data.', state.error);
        state.financialStatements = mockFinancialStatements;
      })
      .addCase(addFinancialStatement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFinancialStatement.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.financialStatements)) {
          state.financialStatements = [];
        }
        state.financialStatements.push(action.payload);
      })
      .addCase(addFinancialStatement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add financial statement';
        console.error('Failed to add financial statement:', state.error);
      })
      .addCase(updateFinancialStatement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFinancialStatement.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.financialStatements.findIndex(statement => statement.id === action.payload.id);
        if (index !== -1) {
           if (!Array.isArray(state.financialStatements)) {
             state.financialStatements = [];
          }
          state.financialStatements[index] = action.payload;
        }
      })
      .addCase(updateFinancialStatement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update financial statement';
        console.error('Failed to update financial statement:', state.error);
      })
      .addCase(deleteFinancialStatement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFinancialStatement.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.financialStatements)) {
          state.financialStatements = [];
        }
        state.financialStatements = state.financialStatements.filter(statement => statement.id !== action.payload);
      })
      .addCase(deleteFinancialStatement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete financial statement';
        console.error('Failed to delete financial statement:', state.error);
      });
  },
});

export const financialStatementsReducer = financialStatementsSlice.reducer; 