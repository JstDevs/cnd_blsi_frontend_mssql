import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialBeginningBalances = [
  {
    id: 1,
    fund: 'General Fund',
    beginningBalance: 1000000.00,
  },
  {
    id: 2,
    fund: 'Special Education Fund',
    beginningBalance: 500000.00,
  },
  {
    id: 3,
    fund: 'Trust Fund',
    beginningBalance: 250000.00,
  },
];

const initialState = {
  beginningBalances: initialBeginningBalances,
  isLoading: false,
  error: null,
};

export const fetchBeginningBalances = createAsyncThunk(
  'beginningBalances/fetchBeginningBalances',
  async (_, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialBeginningBalances);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addBeginningBalance = createAsyncThunk(
  'beginningBalances/addBeginningBalance',
  async (beginningBalance, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newBeginningBalance = {
            ...beginningBalance,
            id: Date.now(),
          };
          resolve(newBeginningBalance);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateBeginningBalance = createAsyncThunk(
  'beginningBalances/updateBeginningBalance',
  async (beginningBalance, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(beginningBalance);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteBeginningBalance = createAsyncThunk(
  'beginningBalances/deleteBeginningBalance',
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

const beginningBalanceSlice = createSlice({
  name: 'beginningBalances',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeginningBalances.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBeginningBalances.fulfilled, (state, action) => {
        state.isLoading = false;
        state.beginningBalances = action.payload;
        state.error = null;
      })
      .addCase(fetchBeginningBalances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addBeginningBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBeginningBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.beginningBalances.push(action.payload);
        state.error = null;
      })
      .addCase(addBeginningBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateBeginningBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBeginningBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.beginningBalances.findIndex((bb) => bb.id === action.payload.id);
        if (index !== -1) {
          state.beginningBalances[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBeginningBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBeginningBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBeginningBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.beginningBalances = state.beginningBalances.filter((bb) => bb.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBeginningBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default beginningBalanceSlice.reducer; 