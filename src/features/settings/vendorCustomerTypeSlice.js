import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockVendorCustomerTypes = [];
export const fetchVendorCustomerTypes = createAsyncThunk(
  'vendorCustomerTypes/fetchVendorCustomerTypes',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/vendorCustomerType`, {
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


export const addVendorCustomerType = createAsyncThunk(
  'vendorCustomerTypes/addVendorCustomerType',
  async (vendorCustomerType, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/vendorCustomerType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(vendorCustomerType),
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

export const updateVendorCustomerType = createAsyncThunk(
  'vendorCustomerTypes/updateVendorCustomerType',
  async (vendorCustomerType, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/vendorCustomerType/${vendorCustomerType.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(vendorCustomerType),
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

export const deleteVendorCustomerType = createAsyncThunk(
  'vendorCustomerTypes/deleteVendorCustomerType',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/vendorCustomerType/${ID}`, {
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

const vendorCustomerTypesSlice = createSlice({
  name: 'vendorCustomerTypes',
  initialState: {
    vendorCustomerTypes: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorCustomerTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorCustomerTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorCustomerTypes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchVendorCustomerTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch vendor customer types';
        console.warn('Failed to fetch vendor customer types, using mock data.', state.error);
        state.vendorCustomerTypes = mockVendorCustomerTypes;
      })
      .addCase(addVendorCustomerType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addVendorCustomerType.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.vendorCustomerTypes)) {
          state.vendorCustomerTypes = [];
        }
        state.vendorCustomerTypes.push(action.payload);
      })
      .addCase(addVendorCustomerType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add vendor customer type';
        console.error('Failed to add vendor customer type:', state.error);
      })
      .addCase(updateVendorCustomerType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVendorCustomerType.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.vendorCustomerTypes.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.vendorCustomerTypes)) {
            state.vendorCustomerTypes = [];
          }
          state.vendorCustomerTypes[index] = action.payload;
        }
      })
      .addCase(deleteVendorCustomerType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVendorCustomerType.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.vendorCustomerTypes)) {
          state.vendorCustomerTypes = [];
        }
        state.vendorCustomerTypes = state.vendorCustomerTypes.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteVendorCustomerType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete vendor customer type';
        console.error('Failed to delete vendor customer type:', state.error);
      });
  },
});

export const vendorCustomerTypesReducer = vendorCustomerTypesSlice.reducer;