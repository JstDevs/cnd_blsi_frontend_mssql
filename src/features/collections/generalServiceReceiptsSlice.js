import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for CRUD operations
export const fetchGeneralServiceReceipts = createAsyncThunk(
  'generalServiceReceipts/fetchGeneralServiceReceipts',
  async () => {
    const response = await axios.get('/api/general-service-receipts');
    return response.data;
  }
);

export const createGeneralServiceReceipt = createAsyncThunk(
  'generalServiceReceipts/createGeneralServiceReceipt',
  async (receiptData) => {
    const response = await axios.post(
      '/api/general-service-receipts',
      receiptData
    );
    return response.data;
  }
);

export const updateGeneralServiceReceipt = createAsyncThunk(
  'generalServiceReceipts/updateGeneralServiceReceipt',
  async ({ id, ...receiptData }) => {
    const response = await axios.put(
      `/api/general-service-receipts/${id}`,
      receiptData
    );
    return response.data;
  }
);

export const deleteGeneralServiceReceipt = createAsyncThunk(
  'generalServiceReceipts/deleteGeneralServiceReceipt',
  async (id) => {
    await axios.delete(`/api/general-service-receipts/${id}`);
    return id;
  }
);
// ✅ Get Current Number
export const getGeneralServiceReceiptCurrentNumber = createAsyncThunk(
  'generalServiceReceipts/getGeneralServiceReceiptCurrentNumber',
  async () => {
    const response = await axios.get(
      '/api/general-service-receipts/getCurrentNumber'
    );
    return response.data;
  }
);
// ===============================
// Initial State
// ===============================
const initialState = {
  receipts: [],
  currentNumber: null, // ✅ store current number
  loading: false,
  error: null,
};

const generalServiceReceiptsSlice = createSlice({
  name: 'generalServiceReceipts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch receipts
      .addCase(fetchGeneralServiceReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeneralServiceReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload;
      })
      .addCase(fetchGeneralServiceReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create receipt
      .addCase(createGeneralServiceReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGeneralServiceReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts.push(action.payload);
      })
      .addCase(createGeneralServiceReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update receipt
      .addCase(updateGeneralServiceReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGeneralServiceReceipt.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.receipts.findIndex(
          (receipt) => receipt.id === action.payload.id
        );
        if (index !== -1) {
          state.receipts[index] = action.payload;
        }
      })
      .addCase(updateGeneralServiceReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete receipt
      .addCase(deleteGeneralServiceReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGeneralServiceReceipt.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = state.receipts.filter(
          (receipt) => receipt.id !== action.payload
        );
      })
      .addCase(deleteGeneralServiceReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ===============================
      // ✅ Get Current Number
      // ===============================
      .addCase(getGeneralServiceReceiptCurrentNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getGeneralServiceReceiptCurrentNumber.fulfilled,
        (state, action) => {
          state.loading = false;
          state.currentNumber = action.payload;
        }
      )
      .addCase(
        getGeneralServiceReceiptCurrentNumber.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { clearError } = generalServiceReceiptsSlice.actions;
export default generalServiceReceiptsSlice.reducer;
