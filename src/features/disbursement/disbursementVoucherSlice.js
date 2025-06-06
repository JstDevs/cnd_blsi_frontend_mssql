import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Generate mock DV data
const generateMockDisbursementVouchers = () => {
  const statuses = ['Pending Certification', 'Pending Approval', 'Approved for Payment', 'Paid', 'Cancelled'];
  const departments = ['Office of the Mayor', 'Accounting Department', 'Treasury Department', 'IT Department'];
  const paymentModes = ['Cash', 'Cheque', 'Bank Transfer'];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    dvNumber: `DV-2024-01-${String(i + 1).padStart(4, '0')}`,
    dvDate: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    payeeName: `Vendor ${i + 1}`,
    particulars: 'Payment for office supplies and equipment',
    orsNumber: `ORS-2024-01-${String(i + 1).padStart(4, '0')}`,
    modeOfPayment: paymentModes[Math.floor(Math.random() * paymentModes.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    grossAmount: Math.floor(Math.random() * 100000) + 10000,
    totalDeductions: Math.floor(Math.random() * 5000),
    netAmount: 0, // Will be calculated
    status: statuses[Math.floor(Math.random() * statuses.length)],
    preparedBy: 'John Smith',
    dateCreated: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString(),
  })).map(dv => ({
    ...dv,
    netAmount: dv.grossAmount - dv.totalDeductions
  }));
};

const initialState = {
  disbursementVouchers: generateMockDisbursementVouchers(),
  disbursementVoucher: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchDisbursementVouchers = createAsyncThunk(
  'disbursementVouchers/fetchAll',
  async (_, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMockDisbursementVouchers());
        }, 500);
      });
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
          const voucher = state.disbursementVouchers.disbursementVouchers.find(dv => dv.id === id);
          if (voucher) {
            resolve(voucher);
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
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newVoucher = {
            ...disbursementVoucher,
            id: Date.now(),
            dvNumber: `DV-2024-01-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            dateCreated: new Date().toISOString(),
            status: 'Pending Certification',
          };
          resolve(newVoucher);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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
      });
  },
});

export const { resetDisbursementVoucherState } = disbursementVoucherSlice.actions;
export default disbursementVoucherSlice.reducer;