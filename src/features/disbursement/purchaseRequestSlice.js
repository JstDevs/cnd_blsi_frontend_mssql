import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialPurchaseRequests = [
  {
    id: 1,
    department: 'IT Department',
    section: 'Section A',
    chargeAccount: 'Account 1',
    prNumber: 'PR-2024-001',
    saiNumber: 'SAI-2024-001',
    alobsNumber: 'ALOBS-2024-001',
    date: '2024-03-15',
    fromDate: '2024-03-15',
    toDate: '2024-03-20',
    purpose: 'Purchase of office supplies',
  },
  {
    id: 2,
    department: 'Engineering Department',
    section: 'Section B',
    chargeAccount: 'Account 2',
    prNumber: 'PR-2024-002',
    saiNumber: 'SAI-2024-002',
    alobsNumber: 'ALOBS-2024-002',
    date: '2024-03-16',
    fromDate: '2024-03-16',
    toDate: '2024-03-21',
    purpose: 'Purchase of construction materials',
  },
];

const initialState = {
  purchaseRequests: initialPurchaseRequests,
  isLoading: false,
  error: null,
};

export const fetchPurchaseRequests = createAsyncThunk(
  'purchaseRequests/fetchPurchaseRequests',
  async (_, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialPurchaseRequests);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addPurchaseRequest = createAsyncThunk(
  'purchaseRequests/addPurchaseRequest',
  async (purchaseRequest, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPurchaseRequest = {
            ...purchaseRequest,
            id: Date.now(),
          };
          resolve(newPurchaseRequest);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePurchaseRequest = createAsyncThunk(
  'purchaseRequests/updatePurchaseRequest',
  async (purchaseRequest, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(purchaseRequest);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deletePurchaseRequest = createAsyncThunk(
  'purchaseRequests/deletePurchaseRequest',
  async (id, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(id);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const purchaseRequestSlice = createSlice({
  name: 'purchaseRequests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPurchaseRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchaseRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchPurchaseRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addPurchaseRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPurchaseRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchaseRequests.push(action.payload);
        state.error = null;
      })
      .addCase(addPurchaseRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePurchaseRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePurchaseRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.purchaseRequests.findIndex((pr) => pr.id === action.payload.id);
        if (index !== -1) {
          state.purchaseRequests[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePurchaseRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deletePurchaseRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePurchaseRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchaseRequests = state.purchaseRequests.filter((pr) => pr.id !== action.payload);
        state.error = null;
      })
      .addCase(deletePurchaseRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default purchaseRequestSlice.reducer; 