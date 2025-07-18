import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Generate mock ORS data
const generateMockObligationRequests = () => {
  const statuses = [
    'Pending',
    'Certified Budget Available',
    'Approved',
    'Obligated',
    'Cancelled',
  ];
  const departments = [
    'Office of the Mayor',
    'Accounting Department',
    'Treasury Department',
    'IT Department',
  ];
  const descriptions = [
    'Purchase of office supplies',
    'Payment for consulting services',
    'Monthly internet subscription',
    'Office equipment maintenance',
    'Seminar expenses',
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    orsNumber: `OBR-2024-01-${String(i + 1).padStart(4, '0')}`,
    orsDate: new Date(2024, 0, Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split('T')[0],
    payeeName: `Vendor ${i + 1}`,
    requestingOffice:
      departments[Math.floor(Math.random() * departments.length)],
    particulars: descriptions[Math.floor(Math.random() * descriptions.length)],
    totalAmount: Math.floor(Math.random() * 100000) + 10000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    preparedBy: 'John Smith',
    dateCreated: new Date(
      2024,
      0,
      Math.floor(Math.random() * 28) + 1
    ).toISOString(),
  }));
};

const initialState = {
  fundUtilizations: [],
  fundUtilization: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls

export const fetchFundUtilizations = createAsyncThunk(
  'fundUtilizations/fetchFundUtilizations',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/fundUtilizationRequest`, {
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

export const fetchFundUtilizationById = createAsyncThunk(
  'fundUtilizations/fetchById',
  async (id, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const state = thunkAPI.getState();
          const request = state.obligationRequests.obligationRequests.find(
            (ors) => ors.id === id
          );
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

export const createFundUtilization = createAsyncThunk(
  'fundUtilizations/create',
  async (fundUtilization, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/fundUtilizationRequest/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: fundUtilization,
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

export const updateFundUtilization = createAsyncThunk(
  'fundUtilizations/update',
  async (fundUtilization, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(fundUtilization);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const fundUtilizationSlice = createSlice({
  name: 'fundUtilizations',
  initialState,
  reducers: {
    resetFundUtilizationState: (state) => {
      state.fundUtilization = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all fund utilizations
      .addCase(fetchFundUtilizations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFundUtilizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fundUtilizations = action.payload;
      })
      .addCase(fetchFundUtilizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single fund utilization
      .addCase(fetchFundUtilizationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFundUtilizationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fundUtilization = action.payload;
      })
      .addCase(fetchFundUtilizationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create fund utilization
      .addCase(createFundUtilization.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFundUtilization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fundUtilizations.push(action.payload);
      })
      .addCase(createFundUtilization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update fund utilization
      .addCase(updateFundUtilization.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFundUtilization.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.fundUtilizations.findIndex(
          (ors) => ors.id === action.payload.id
        );
        if (index !== -1) {
          state.fundUtilizations[index] = action.payload;
        }
      })
      .addCase(updateFundUtilization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetFundUtilizationState } = fundUtilizationSlice.actions;
export default fundUtilizationSlice.reducer;
