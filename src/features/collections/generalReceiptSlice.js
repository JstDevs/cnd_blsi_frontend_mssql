import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Generate mock receipt data
const generateMockGeneralReceipts = () => {
  const statuses = ['Valid', 'Cancelled'];
  const departments = ['Office of the Mayor', 'Accounting Department', 'Treasury Department', 'IT Department'];
  const paymentModes = ['Cash', 'Cheque', 'Bank Transfer'];
  const funds = ['General Fund', 'Special Education Fund', 'Trust Fund'];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    receiptNumber: `OR-2024-01-${String(i + 1).padStart(4, '0')}`,
    receiptDate: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    payorName: `Payor ${i + 1}`,
    payorAddress: 'Sample Address, Municipality',
    fund: funds[Math.floor(Math.random() * funds.length)],
    modeOfPayment: paymentModes[Math.floor(Math.random() * paymentModes.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    totalAmount: Math.floor(Math.random() * 50000) + 1000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    collectedBy: 'Jane Doe',
    dateCreated: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString(),
    chequeNumber: null,
    chequeDate: null,
    draweeBank: null,
    ePaymentReference: null,
  }));
};

const initialState = {
  generalReceipts: generateMockGeneralReceipts(),
  generalReceipt: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchGeneralReceipts = createAsyncThunk(
  'generalReceipts/fetchAll',
  async (_, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMockGeneralReceipts());
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchGeneralReceiptById = createAsyncThunk(
  'generalReceipts/fetchById',
  async (id, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const state = thunkAPI.getState();
          const receipt = state.generalReceipts.generalReceipts.find(r => r.id === id);
          if (receipt) {
            resolve(receipt);
          } else {
            reject(new Error('General receipt not found'));
          }
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createGeneralReceipt = createAsyncThunk(
  'generalReceipts/create',
  async (generalReceipt, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newReceipt = {
            ...generalReceipt,
            id: Date.now(),
            receiptNumber: `OR-2024-01-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            dateCreated: new Date().toISOString(),
            status: 'Valid',
          };
          resolve(newReceipt);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateGeneralReceipt = createAsyncThunk(
  'generalReceipts/update',
  async (generalReceipt, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generalReceipt);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const generalReceiptSlice = createSlice({
  name: 'generalReceipts',
  initialState,
  reducers: {
    resetGeneralReceiptState: (state) => {
      state.generalReceipt = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all general receipts
      .addCase(fetchGeneralReceipts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGeneralReceipts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalReceipts = action.payload;
      })
      .addCase(fetchGeneralReceipts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single general receipt
      .addCase(fetchGeneralReceiptById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGeneralReceiptById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalReceipt = action.payload;
      })
      .addCase(fetchGeneralReceiptById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create general receipt
      .addCase(createGeneralReceipt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGeneralReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalReceipts.push(action.payload);
      })
      .addCase(createGeneralReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update general receipt
      .addCase(updateGeneralReceipt.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateGeneralReceipt.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.generalReceipts.findIndex(
          (receipt) => receipt.id === action.payload.id
        );
        if (index !== -1) {
          state.generalReceipts[index] = action.payload;
        }
      })
      .addCase(updateGeneralReceipt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetGeneralReceiptState } = generalReceiptSlice.actions;
export default generalReceiptSlice.reducer;