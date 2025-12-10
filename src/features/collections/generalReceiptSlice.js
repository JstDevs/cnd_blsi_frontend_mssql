import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockGeneralServiceReceipts = [];

// Async thunks for CRUD operations
export const fetchGeneralServiceReceipts = createAsyncThunk(
  'generalServiceReceipts/fetchGeneralServiceReceipts',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/generalservicerecipt`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const fetchGeneralServiceReceiptById = createAsyncThunk(
  'generalServiceReceipts/fetchGeneralServiceReceiptById',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/general-service-receipts/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createGeneralServiceReceipt = createAsyncThunk(
  'generalServiceReceipts/createGeneralServiceReceipt',
  async (receiptData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/generalservicerecipt`,
        receiptData, // This should be the FormData object
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateGeneralServiceReceipt = createAsyncThunk(
  'generalServiceReceipts/updateGeneralServiceReceipt',
  async ({ id, ...receiptData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/generalservicerecipt/${id}`,
        receiptData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const deleteGeneralServiceReceipt = createAsyncThunk(
  'generalServiceReceipts/deleteGeneralServiceReceipt',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/generalservicerecipt/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ✅ Get Current Number
export const getGeneralServiceReceiptCurrentNumber = createAsyncThunk(
  'generalServiceReceipts/getGeneralServiceReceiptCurrentNumber',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/generalservicerecipt/getCurrentNumber`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
const generalServiceReceiptsSlice = createSlice({
  name: 'generalServiceReceipts',
  initialState: {
    receipts: [],
    currentReceipt: null,
    isLoading: false,
    currentNumber: null, // ✅ store current number
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReceipt: (state) => {
      state.currentReceipt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch receipts
      .addCase(fetchGeneralServiceReceipts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneralServiceReceipts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.receipts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGeneralServiceReceipts.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to fetch general service receipts';
        console.warn(
          'Failed to fetch general service receipts, using mock data.',
          state.error
        );
        state.receipts = mockGeneralServiceReceipts;
      })

      // Fetch receipt by ID
      .addCase(fetchGeneralServiceReceiptById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneralServiceReceiptById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReceipt = action.payload;
      })
      .addCase(fetchGeneralServiceReceiptById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to fetch general service receipt';
      })

      // Create receipt
      .addCase(createGeneralServiceReceipt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGeneralServiceReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.receipts)) {
          state.receipts = [];
        }
        state.receipts.push(action.payload);
      })
      .addCase(createGeneralServiceReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to create general service receipt';
        console.error('Failed to create general service receipt:', state.error);
      })

      // Update receipt
      .addCase(updateGeneralServiceReceipt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGeneralServiceReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.receipts.findIndex(
          (receipt) => receipt.id === action.payload.id
        );
        if (index !== -1) {
          if (!Array.isArray(state.receipts)) {
            state.receipts = [];
          }
          state.receipts[index] = action.payload;
        }
        if (
          state.currentReceipt &&
          state.currentReceipt.id === action.payload.id
        ) {
          state.currentReceipt = action.payload;
        }
      })
      .addCase(updateGeneralServiceReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to update general service receipt';
        console.error('Failed to update general service receipt:', state.error);
      })

      // Delete receipt
      .addCase(deleteGeneralServiceReceipt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGeneralServiceReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.receipts)) {
          state.receipts = [];
        }
        state.receipts = state.receipts.filter(
          (receipt) => receipt.id !== action.payload
        );
        if (
          state.currentReceipt &&
          state.currentReceipt.id === action.payload
        ) {
          state.currentReceipt = null;
        }
      })
      .addCase(deleteGeneralServiceReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to delete general service receipt';
        console.error('Failed to delete general service receipt:', state.error);
      })
      // ✅ Get Current Number
      .addCase(getGeneralServiceReceiptCurrentNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getGeneralServiceReceiptCurrentNumber.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.currentNumber = action.payload;
        }
      )
      .addCase(
        getGeneralServiceReceiptCurrentNumber.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error =
            action.payload ||
            'Failed to fetch general service receipt current number';
        }
      );
  },
});

export const { clearError, clearCurrentReceipt } =
  generalServiceReceiptsSlice.actions;
export default generalServiceReceiptsSlice.reducer;
