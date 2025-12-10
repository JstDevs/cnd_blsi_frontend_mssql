import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  disbursementVouchers: [],
  disbursementVoucher: null,
  isLoading: false,
  error: null,
  requestOptions: [],
  requestOptionsLoading: false,
  requestOptionsError: null,
};

// Thunks for API calls
export const fetchRequestOptions = createAsyncThunk(
  'disbursementVouchers/fetchRequestOptions',
  async ({ requestType, payeeType, payeeId }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const url =
        `${API_URL}/disbursementVoucher/selectListForDV` +
        `?type=${encodeURIComponent(payeeType)}` +
        `&requestType=${encodeURIComponent(requestType)}` +
        `&id=${payeeId}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Failed to fetch request options'
        );
      }

      // Map once for react‑select
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchDisbursementVouchers = createAsyncThunk(
  'disbursementVouchers/fetchDisbursementVouchers',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/disbursementVoucher`, {
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

export const fetchDisbursementVoucherById = createAsyncThunk(
  'disbursementVouchers/fetchById',
  async (id, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const state = thunkAPI.getState();
          const request = state.disbursementVouchers.disbursementVouchers.find(
            (ors) => ors.id === id
          );
          if (request) {
            resolve(request);
          } else {
            reject(new Error('Disbursement voucher not found'));
          }
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createDisbursementVoucher = createAsyncThunk(
  'disbursementVouchers/create',
  async (disbursementVoucher, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/disbursementVoucher/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: disbursementVoucher,
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateDisbursementVoucher = createAsyncThunk(
  'disbursementVouchers/update',
  async (disbursementVoucher, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(disbursementVoucher);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const disbursementVoucherSlice = createSlice({
  name: 'disbursementVouchers',
  initialState,
  reducers: {
    resetDisbursementVoucherState: (state) => {
      state.disbursementVoucher = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all disbursement vouchers
      .addCase(fetchDisbursementVouchers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDisbursementVouchers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.disbursementVouchers = action.payload;
      })
      .addCase(fetchDisbursementVouchers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single disbursement voucher
      .addCase(fetchDisbursementVoucherById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDisbursementVoucherById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.disbursementVoucher = action.payload;
      })
      .addCase(fetchDisbursementVoucherById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create disbursement voucher
      .addCase(createDisbursementVoucher.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDisbursementVoucher.fulfilled, (state, action) => {
        state.isLoading = false;
        state.disbursementVouchers.push(action.payload);
      })
      .addCase(createDisbursementVoucher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update disbursement voucher
      .addCase(updateDisbursementVoucher.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDisbursementVoucher.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.disbursementVouchers.findIndex(
          (dv) => dv.id === action.payload.id
        );
        if (index !== -1) {
          state.disbursementVouchers[index] = action.payload;
        }
      })
      .addCase(updateDisbursementVoucher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRequestOptions.pending, (state) => {
        state.requestOptionsLoading = true;
        state.requestOptionsError = null;
      })
      .addCase(fetchRequestOptions.fulfilled, (state, action) => {
        state.requestOptionsLoading = false;
        state.requestOptions = action.payload;
      })
      .addCase(fetchRequestOptions.rejected, (state, action) => {
        state.requestOptionsLoading = false;
        state.requestOptionsError = action.payload;
      });
  },
});

export const { resetDisbursementVoucherState } =
  disbursementVoucherSlice.actions;
export default disbursementVoucherSlice.reducer;
