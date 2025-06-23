import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockVendorTypes = [];
export const fetchVendorTypes = createAsyncThunk(
  'vendorTypes/fetchVendorTypes',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/vendorType`, {
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


export const addVendorType = createAsyncThunk(
  'vendorTypes/addVendorType',
  async (vendorType, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/vendorType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(vendorType),
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

export const updateVendorType = createAsyncThunk(
  'vendorTypes/updateVendorType',
  async (vendorType, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/vendorType/${vendorType.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(vendorType),
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

export const deleteVendorType = createAsyncThunk(
  'vendorTypes/deleteVendorType',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/vendorType/${ID}`, {
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

const vendorTypesSlice = createSlice({
  name: 'vendorTypes',
  initialState: {
    vendorTypes: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorTypes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchVendorTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch vendor types';
        console.warn('Failed to fetch vendor types, using mock data.', state.error);
        state.vendorTypes = mockVendorTypes;
      })
      .addCase(addVendorType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addVendorType.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.vendorTypes)) {
          state.vendorTypes = [];
        }
        state.vendorTypes.push(action.payload);
      })
      .addCase(addVendorType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add vendor type';
        console.error('Failed to add vendor type:', state.error);
      })
      .addCase(updateVendorType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVendorType.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.vendorTypes.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.vendorTypes)) {
            state.vendorTypes = [];
          }
          state.vendorTypes[index] = action.payload;
        }
      })
      .addCase(deleteVendorType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVendorType.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.vendorTypes)) {
          state.vendorTypes = [];
        }
        state.vendorTypes = state.vendorTypes.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteVendorType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete vendor type';
        console.error('Failed to delete vendor type:', state.error);
      });
  },
});

export const vendorTypesReducer = vendorTypesSlice.reducer;