import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockBarangays = [];
export const fetchBarangays = createAsyncThunk(
  'barangays/fetchBarangays',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/barangay`, {
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


export const addBarangay = createAsyncThunk(
  'barangays/addBarangay',
  async (barangay, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/barangay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(barangay),
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

export const updateBarangay = createAsyncThunk(
  'barangays/updateBarangay',
  async (barangay, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/barangay/${barangay.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(barangay),
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

export const deleteBarangay = createAsyncThunk(
  'barangays/deleteBarangay',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/barangay/${ID}`, {
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

const barangaysSlice = createSlice({
  name: 'barangays',
  initialState: {
    barangays: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBarangays.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBarangays.fulfilled, (state, action) => {
        state.isLoading = false;
        state.barangays = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBarangays.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch barangays';
        console.warn('Failed to fetch barangays, using mock data.', state.error);
        state.barangays = mockBarangays; // Fallback to mock data
      })
      .addCase(addBarangay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBarangay.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.barangays)) {
          state.barangays = [];
        }
        state.barangays.push(action.payload);
      })
      .addCase(addBarangay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add barangay';
        console.error('Failed to add barangay:', state.error);
      })
      .addCase(updateBarangay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBarangay.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.barangays.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.barangays)) {
            state.barangays = [];
          }
          state.barangays[index] = action.payload;
        }
      })
      .addCase(deleteBarangay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBarangay.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.barangays)) {
          state.barangays = [];
        }
        state.barangays = state.barangays.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteBarangay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete barangay';
        console.error('Failed to delete barangay:', state.error);
      });
  },
});

export const barangaysReducer = barangaysSlice.reducer;