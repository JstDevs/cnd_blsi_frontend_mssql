import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockSubFunds = [];
export const fetchSubFunds = createAsyncThunk(
  'subFunds/fetchSubFunds',
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

export const addSubFund = createAsyncThunk(
  'subFunds/addSubFund',
  async (subFund, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/subFunds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(subFund),
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

export const updateSubFund = createAsyncThunk(
  'subFunds/updateSubFund',
  async (subFund, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/subFunds`, {
        method: 'POST',
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

export const deleteSubFund = createAsyncThunk(
  'subFunds/deleteSubFund',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/subFunds/${ID}`, {
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

const subFundsSlice = createSlice({
  name: 'subFunds',
  initialState: {
    subFunds: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubFunds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubFunds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subFunds = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubFunds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch sub funds';
        console.warn(
          'Failed to fetch sub funds, using mock data.',
          state.error
        );
        state.subFunds = mockSubFunds;
      })
      .addCase(addSubFund.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addSubFund.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.subFunds)) {
          state.subFunds = [];
        }
        state.subFunds.push(action.payload);
      })
      .addCase(addSubFund.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add sub fund';
        console.error('Failed to add sub fund:', state.error);
      })
      .addCase(updateSubFund.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubFund.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subFunds.findIndex(
          (item) => item.ID === action.payload.ID
        );
        if (index !== -1) {
          if (!Array.isArray(state.subFunds)) {
            state.subFunds = [];
          }
          state.subFunds[index] = action.payload;
        }
      })
      .addCase(deleteSubFund.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubFund.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.subFunds)) {
          state.subFunds = [];
        }
        state.subFunds = state.subFunds.filter(
          (item) => item.ID !== action.payload
        );
      })
      .addCase(deleteSubFund.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete sub fund';
        console.error('Failed to delete sub fund:', state.error);
      });
  },
});

export const subFundsReducer = subFundsSlice.reducer;
