import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Generate mock travel order data
const generateMockTravelOrders = () => {
  const statuses = ['Pending Recommendation', 'Pending Approval', 'Approved', 'Liquidated', 'Cancelled'];
  const departments = ['Office of the Mayor', 'Accounting Department', 'Treasury Department', 'IT Department'];
  const destinations = ['Manila', 'Cebu', 'Davao', 'Baguio'];
  const purposes = [
    'Attend training seminar',
    'Official meeting with DILG',
    'Conference participation',
    'Project monitoring',
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    toNumber: `TO-2024-01-${String(i + 1).padStart(4, '0')}`,
    toDate: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    employeeName: `Employee ${i + 1}`,
    position: 'Administrative Officer III',
    department: departments[Math.floor(Math.random() * departments.length)],
    destination: destinations[Math.floor(Math.random() * destinations.length)],
    purpose: purposes[Math.floor(Math.random() * purposes.length)],
    departureDate: new Date(2024, 1, Math.floor(Math.random() * 28) + 1).toISOString(),
    returnDate: new Date(2024, 1, Math.floor(Math.random() * 28) + 8).toISOString(),
    estimatedExpenses: Math.floor(Math.random() * 20000) + 5000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    preparedBy: 'John Smith',
    dateCreated: new Date(2024, 0, Math.floor(Math.random() * 28) + 1).toISOString(),
  }));
};

const initialState = {
  travelOrders: generateMockTravelOrders(),
  travelOrder: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchTravelOrders = createAsyncThunk(
  'travelOrders/fetchAll',
  async (_, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMockTravelOrders());
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchTravelOrderById = createAsyncThunk(
  'travelOrders/fetchById',
  async (id, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const state = thunkAPI.getState();
          const order = state.travelOrders.travelOrders.find(to => to.id === id);
          if (order) {
            resolve(order);
          } else {
            reject(new Error('Travel order not found'));
          }
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createTravelOrder = createAsyncThunk(
  'travelOrders/create',
  async (travelOrder, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newOrder = {
            ...travelOrder,
            id: Date.now(),
            toNumber: `TO-2024-01-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            dateCreated: new Date().toISOString(),
            status: 'Pending Recommendation',
          };
          resolve(newOrder);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateTravelOrder = createAsyncThunk(
  'travelOrders/update',
  async (travelOrder, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(travelOrder);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const travelOrderSlice = createSlice({
  name: 'travelOrders',
  initialState,
  reducers: {
    resetTravelOrderState: (state) => {
      state.travelOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all travel orders
      .addCase(fetchTravelOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTravelOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.travelOrders = action.payload;
      })
      .addCase(fetchTravelOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single travel order
      .addCase(fetchTravelOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTravelOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.travelOrder = action.payload;
      })
      .addCase(fetchTravelOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create travel order
      .addCase(createTravelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTravelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.travelOrders.push(action.payload);
      })
      .addCase(createTravelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update travel order
      .addCase(updateTravelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTravelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.travelOrders.findIndex(
          (to) => to.id === action.payload.id
        );
        if (index !== -1) {
          state.travelOrders[index] = action.payload;
        }
      })
      .addCase(updateTravelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTravelOrderState } = travelOrderSlice.actions;
export default travelOrderSlice.reducer;