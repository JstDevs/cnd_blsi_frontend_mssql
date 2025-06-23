import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockModeOfPayments = [];
export const fetchModeOfPayments = createAsyncThunk(
  'modeOfPayments/fetchModeOfPayments',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/paymentMethod`, {
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


export const addModeOfPayment = createAsyncThunk(
  'modeOfPayments/addModeOfPayment',
  async (modeOfPayment, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/paymentMethod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(modeOfPayment),
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

export const updateModeOfPayment = createAsyncThunk(
  'modeOfPayments/updateModeOfPayment',
  async (modeOfPayment, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/paymentMethod/${modeOfPayment.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(modeOfPayment),
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

export const deleteModeOfPayment = createAsyncThunk(
  'modeOfPayments/deleteModeOfPayment',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/paymentMethod/${ID}`, {
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

const modeOfPaymentsSlice = createSlice({
  name: 'modeOfPayments',
  initialState: {
    modeOfPayments: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModeOfPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchModeOfPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modeOfPayments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchModeOfPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch mode of payments';
        console.warn('Failed to fetch mode of payments, using mock data.', state.error);
        state.modeOfPayments = mockModeOfPayments;
      })
      .addCase(addModeOfPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addModeOfPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.modeOfPayments)) {
          state.modeOfPayments = [];
        }
        state.modeOfPayments.push(action.payload);
      })
      .addCase(addModeOfPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add mode of payment';
        console.error('Failed to add mode of payment:', state.error);
      })
      .addCase(updateModeOfPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateModeOfPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.modeOfPayments.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.modeOfPayments)) {
            state.modeOfPayments = [];
          }
          state.modeOfPayments[index] = action.payload;
        }
      })
      .addCase(deleteModeOfPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteModeOfPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.modeOfPayments)) {
          state.modeOfPayments = [];
        }
        state.modeOfPayments = state.modeOfPayments.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteModeOfPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete mode of payment';
        console.error('Failed to delete mode of payment:', state.error);
      });
  },
});

export const modeOfPaymentsReducer = modeOfPaymentsSlice.reducer;