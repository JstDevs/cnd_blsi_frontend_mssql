import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Generate mock ORS data
const generateMockObligationRequests = () => {
  const statuses = ['Pending', 'Certified Budget Available', 'Approved', 'Obligated', 'Cancelled'];
  const departments = ['Office of the Mayor', 'Accounting Department', 'Treasury Department', 'IT Department'];
  const descriptions = [
    'Purchase of office supplies',
    'Payment for consulting services',
    'Monthly internet subscription',
    'Office equipment maintenance',
    'Seminar expenses',
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    orsNumber: `ORS-2024-01-${String(i + 1).padStart(4, '0')}`,
    orsDate: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    payeeName: `Vendor ${i + 1}`,
    requestingOffice: departments[Math.floor(Math.random() * departments.length)],
    particulars: descriptions[Math.floor(Math.random() * descriptions.length)],
    totalAmount: Math.floor(Math.random() * 100000) + 10000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    preparedBy: 'John Smith',
    dateCreated: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString(),
  }));
};

const initialState = {
  obligationRequests: generateMockObligationRequests(),
  obligationRequest: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchObligationRequests = createAsyncThunk(
  'obligationRequests/fetchAll',
  async (_, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMockObligationRequests());
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchObligationRequestById = createAsyncThunk(
  'obligationRequests/fetchById',
  async (id, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const state = thunkAPI.getState();
          const request = state.obligationRequests.obligationRequests.find(ors => ors.id === id);
          if (request) {
            resolve(request);
          } else {
            reject(new Error('Obligation request not found'));
          }
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createObligationRequest = createAsyncThunk(
  'obligationRequests/create',
  async (obligationRequest, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newRequest = {
            ...obligationRequest,
            id: Date.now(),
            orsNumber: `ORS-2024-01-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            dateCreated: new Date().toISOString(),
            status: 'Pending',
          };
          resolve(newRequest);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateObligationRequest = createAsyncThunk(
  'obligationRequests/update',
  async (obligationRequest, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(obligationRequest);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const obligationRequestSlice = createSlice({
  name: 'obligationRequests',
  initialState,
  reducers: {
    resetObligationRequestState: (state) => {
      state.obligationRequest = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all obligation requests
      .addCase(fetchObligationRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchObligationRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.obligationRequests = action.payload;
      })
      .addCase(fetchObligationRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single obligation request
      .addCase(fetchObligationRequestById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchObligationRequestById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.obligationRequest = action.payload;
      })
      .addCase(fetchObligationRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create obligation request
      .addCase(createObligationRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createObligationRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.obligationRequests.push(action.payload);
      })
      .addCase(createObligationRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update obligation request
      .addCase(updateObligationRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateObligationRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.obligationRequests.findIndex(
          (ors) => ors.id === action.payload.id
        );
        if (index !== -1) {
          state.obligationRequests[index] = action.payload;
        }
      })
      .addCase(updateObligationRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetObligationRequestState } = obligationRequestSlice.actions;
export default obligationRequestSlice.reducer;