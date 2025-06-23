import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockEmploymentStatuses = [];
// const mockEmploymentStatuses = [
//   { id: '1', name: 'Employed' },
//   { id: '2', name: 'Unemployed' },
//   { id: '3', name: 'Self-Employed' },
// ];

// Async Thunks (Mock API calls)
// export const fetchEmploymentStatuses = createAsyncThunk('employmentStatuses/fetchEmploymentStatuses', async () => {
//   console.log('Mock API call: Fetching employment statuses');
//   return new Promise(resolve => setTimeout(() => resolve(mockEmploymentStatuses), 500));
// });
export const fetchEmploymentStatuses = createAsyncThunk(
  'employmentStatuses/fetchEmploymentStatuses',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/employmentStatus`, {
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

// export const addEmploymentStatus = createAsyncThunk('employmentStatuses/addEmploymentStatus', async (employmentStatus) => {
//   console.log('Mock API call: Adding employment status', employmentStatus);
//   const newEmploymentStatus = { ...employmentStatus, id: Date.now().toString() }; // Assign a mock ID
//   return new Promise(resolve => setTimeout(() => resolve(newEmploymentStatus), 500));
// });
export const addEmploymentStatus = createAsyncThunk(
  'employmentStatuses/addEmploymentStatus',
  async (employmentStatus, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/employmentStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(employmentStatus),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// export const updateEmploymentStatus = createAsyncThunk('employmentStatuses/updateEmploymentStatus', async (employmentStatus) => {
//   console.log('Mock API call: Updating employment status', employmentStatus);
//   return new Promise(resolve => setTimeout(() => resolve(employmentStatus), 500));
// });
export const updateEmploymentStatus = createAsyncThunk(
  'employmentStatuses/updateEmploymentStatus',
  async (employmentStatus, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/employmentStatus/${employmentStatus.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(employmentStatus),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// export const deleteEmploymentStatus = createAsyncThunk('employmentStatuses/deleteEmploymentStatus', async (id) => {
//   console.log('Mock API call: Deleting employment status with ID', id);
//   return new Promise(resolve => setTimeout(() => resolve(id), 500));
// });

export const deleteEmploymentStatus = createAsyncThunk(
  'employmentStatuses/deleteEmploymentStatus',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/employmentStatus/${ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete');
      }

      return ID; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const employmentStatusSlice = createSlice({
  name: 'employmentStatuses',
  initialState: {
    employmentStatuses: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmploymentStatuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmploymentStatuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employmentStatuses = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEmploymentStatuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch employment statuses';
        console.warn('Failed to fetch employment statuses, using mock data.', state.error);
        state.employmentStatuses = mockEmploymentStatuses;
      })
      .addCase(addEmploymentStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addEmploymentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.employmentStatuses)) {
          state.employmentStatuses = [];
        }
        state.employmentStatuses.push(action.payload);
      })
      .addCase(addEmploymentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add employment status';
        console.error('Failed to add employment status:', state.error);
      })
      .addCase(updateEmploymentStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEmploymentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.employmentStatuses.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
           if (!Array.isArray(state.employmentStatuses)) {
             state.employmentStatuses = [];
          }
          state.employmentStatuses[index] = action.payload;
        }
      })
      .addCase(deleteEmploymentStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEmploymentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.employmentStatuses)) {
          state.employmentStatuses = [];
        }
        state.employmentStatuses = state.employmentStatuses.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteEmploymentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete employment status';
        console.error('Failed to delete employment status:', state.error);
      });
  },
});

export const employmentStatusReducer = employmentStatusSlice.reducer;