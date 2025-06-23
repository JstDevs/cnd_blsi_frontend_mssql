import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialFinancialStatements = [];
const initialState = {
  financialStatements: initialFinancialStatements,
  financialStatement: null,
  isLoading: false,
  error: null,
};

export const fetchFinancialStatements = createAsyncThunk(
  'financialStatements/fetchFinancialStatements',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/financialStatement`, {
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

export const addFinancialStatement = createAsyncThunk(
  'financialStatements/addFinancialStatement',
  async (financialStatement, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/financialStatement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(financialStatement),
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

export const updateFinancialStatement = createAsyncThunk(
  'financialStatements/updateFinancialStatement',
  async (financialStatement, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/financialStatement/${financialStatement.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(financialStatement),
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

export const deleteFinancialStatement = createAsyncThunk(
  'financialStatements/deleteFinancialStatement',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/financialStatement/${ID}`, {
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

const financialStatementSlice = createSlice({
  name: 'financialStatements',
  initialState,
  reducers: {
    setFinancialStatement: (state, action) => {
      state.financialStatement = action.payload;
    },
    resetFinancialStatementState: (state) => {
      state.financialStatement = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch financial statements
      .addCase(fetchFinancialStatements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFinancialStatements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.financialStatements = action.payload;
        state.error = null;
      })
      .addCase(fetchFinancialStatements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add financial statement
      .addCase(addFinancialStatement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFinancialStatement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.financialStatements.push(action.payload);
        state.error = null;
      })
      .addCase(addFinancialStatement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update financial statement
      .addCase(updateFinancialStatement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFinancialStatement.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.financialStatements.findIndex(
          (financialStatement) => financialStatement.ID === action.payload.ID
        );
        if (index !== -1) {
          state.financialStatements[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateFinancialStatement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete financial statement
      .addCase(deleteFinancialStatement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFinancialStatement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.financialStatements = state.financialStatements.filter(
          (financialStatement) => financialStatement.ID !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteFinancialStatement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFinancialStatement, resetFinancialStatementState } = financialStatementSlice.actions;

export default financialStatementSlice.reducer;