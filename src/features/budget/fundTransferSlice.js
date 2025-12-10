import axiosInstance from '@/utils/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

// Async Thunks
export const fetchFundOptions = createAsyncThunk(
  'fundTransfer/fetchFundOptions',
  async () => {
    const response = await axiosInstance.get('/fundTransfer/fundList');
    return response.data;
  }
);

export const fetchFundTransfers = createAsyncThunk(
  'fundTransfer/fetchFundTransfers',
  async () => {
    const response = await axiosInstance.get('/fundTransfer/list');
    return response.data;
  }
);

export const createFundTransfer = createAsyncThunk(
  'fundTransfer/createFundTransfer',
  async (values) => {
    const response = await axiosInstance.post('/fundTransfer/save', values, {
      headers: {
        'Content-Type': 'multipart/form-data', // Required for FormData
      },
    });
    toast.success('Fund transfer created successfully');
    return response.data;
  }
);

export const deleteFundTransfer = createAsyncThunk(
  'fundTransfer/deleteFundTransfer',
  async (id) => {
    await axiosInstance.delete(`/fundTransfer/${id}`);
    toast.success('Fund transfer deleted successfully');
    return id;
  }
);

const fundTransferSlice = createSlice({
  name: 'fundTransfer',
  initialState: {
    fundOptions: [], // For the select dropdown
    transfers: [], // For the table data
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      // Fetch fund options
      .addCase(fetchFundOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFundOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.fundOptions = action.payload || [];
      })
      .addCase(fetchFundOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to fetch fund options');
      })

      // Fetch fund transfers
      .addCase(fetchFundTransfers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFundTransfers.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = action.payload || [];
      })
      .addCase(fetchFundTransfers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to fetch fund transfers');
      })

      // Create fund transfer
      .addCase(createFundTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFundTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = [...state.transfers, action.payload];
      })
      .addCase(createFundTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to create fund transfer');
      })

      // Delete fund transfer
      .addCase(deleteFundTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFundTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = state.transfers.filter(
          (transfer) => transfer.id !== action.payload
        );
      })
      .addCase(deleteFundTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        toast.error('Failed to delete fund transfer');
      });
  },
});

export default fundTransferSlice.reducer;
