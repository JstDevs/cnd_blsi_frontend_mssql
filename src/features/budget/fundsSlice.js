import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockFunds = [
  { ID: 1, Name: 'Fund A', Code: 101 },
  { ID: 2, Name: 'Fund B', Code: 102 },
  { ID: 3, Name: 'Fund C', Code: 103 },
];
export const fetchFunds = createAsyncThunk(
  'funds/fetchFunds',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/fundsss`, {
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

export const addFund = createAsyncThunk(
  'funds/addFund',
  async (fund, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(fund),
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

export const updateFund = createAsyncThunk(
  'funds/updateFund',
  async (fund, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/funds/${fund.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(subFund),
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

export const deleteFund = createAsyncThunk(
  'funds/deleteFund',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/funds/${ID}`, {
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

const fundsSlice = createSlice({
  name: 'funds',
  initialState: {
    funds: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFunds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFunds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.funds = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFunds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch funds';
        console.warn('Failed to fetch funds, using mock data.', state.error);
        state.funds = mockFunds;
      })
      .addCase(addFund.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFund.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.funds)) {
          state.funds = [];
        }
        state.funds.push(action.payload);
      })
      .addCase(addFund.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add fund';
        console.error('Failed to add fund:', state.error);
      })
      .addCase(updateFund.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFund.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.funds.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.funds)) {
            state.funds = [];
          }
          state.funds[index] = action.payload;
        }
      })
      .addCase(deleteFund.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFund.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.funds)) {
          state.funds = [];
        }
        state.funds = state.funds.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteFund.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete fund';
        console.error('Failed to delete fund:', state.error);
      });
  },
});

export const fundsReducer = fundsSlice.reducer;