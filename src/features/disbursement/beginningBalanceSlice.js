import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for initial development
const mockBeginningBalance = []

const initialState = {
  beginningBalance: [],
  isLoading: false,
  error: null,
};

// Async thunks

export const fetchBeginningBalance = createAsyncThunk(
  'beginningBalance/fetchBalance',
  async (filters, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/beginningBalance/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filters),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch');
      }

      return res;
    } catch (error) {
      console.log('Error fetching beginning balance:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addBeginningBalance = createAsyncThunk(
  'beginningBalance/addBeginningBalance',
  async (beginningBalance, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/beginningBalance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(beginningBalance),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateBeginningBalance = createAsyncThunk(
  'beginningBalance/updateBeginningBalance',
  async (beginningBalance, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/beginningBalance/${beginningBalance.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(beginningBalance),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to update');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const transferBeginningBalance = createAsyncThunk(
  'beginningBalance/transferBeginningBalance',
  async (beginningBalance, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/beginningBalance/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(beginningBalance),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteBeginningBalance = createAsyncThunk(
  'beginningBalance/deleteBeginningBalance',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/beginningBalance/${ID}`, {
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

const beginningBalanceSlice = createSlice({
  name: 'beginningBalance',
  initialState,
  reducers: {
    resetBeginningBalanceState: (state) => {
      state.beginningBalance = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Beginning Balance
      .addCase(fetchBeginningBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBeginningBalance  .fulfilled, (state, action) => {
        state.isLoading = false;
        state.beginningBalance = action.payload;
      })
      .addCase(fetchBeginningBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addBeginningBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBeginningBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        // if (!Array.isArray(state.beginningBalance)) {
        //   state.beginningBalance = [];
        // }
        // state.beginningBalance.push(action.payload);
      })
      .addCase(addBeginningBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateBeginningBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBeginningBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.beginningBalance.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.beginningBalance)) {
            state.beginningBalance = [];
          }
          state.beginningBalance[index] = action.payload;
        }
      })
      .addCase(updateBeginningBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to update beginning balance';
      })
      .addCase(transferBeginningBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(transferBeginningBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        // if (!Array.isArray(state.beginningBalance)) {
        //   state.beginningBalance = [];
        // }
        // state.beginningBalance.push(action.payload);
      })
      .addCase(transferBeginningBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteBeginningBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBeginningBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.beginningBalance)) {
          state.beginningBalance = [];
        }
        state.beginningBalance = state.beginningBalance.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteBeginningBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete beginning balance';
        console.error('Failed to delete beginning balance:', state.error);
      })
  },
});

export const { resetBeginningBalanceState } = beginningBalanceSlice.actions;

export default beginningBalanceSlice.reducer; 