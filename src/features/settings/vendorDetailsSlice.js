import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockVendorDetails = [];
export const fetchVendorDetails = createAsyncThunk(
  'vendorDetails/fetchVendorDetails',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/vendor`, {
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


export const addVendorDetails = createAsyncThunk(
  'vendorDetails/addVendorDetails',
  async (vendorDetails, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/vendor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(vendorDetails),
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

export const updateVendorDetails = createAsyncThunk(
  'vendorDetails/updateVendorDetails',
  async (vendorDetails, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/vendor/${vendorDetails.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(vendorDetails),
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

export const deleteVendorDetails = createAsyncThunk(
  'vendorDetails/deleteVendorDetails',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/vendor/${ID}`, {
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

const vendorDetailsSlice = createSlice({
  name: 'vendorDetails',
  initialState: {
    vendorDetails: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorDetails = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchVendorDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch vendor details';
        console.warn('Failed to fetch vendor details, using mock data.', state.error);
        state.vendorDetails = mockVendorDetails; // Use mock data if fetch fails
      })
      .addCase(addVendorDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addVendorDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.vendorDetails)) {
          state.vendorDetails = [];
        }
        state.vendorDetails.push(action.payload);
      })
      .addCase(addVendorDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add vendor details';
        console.error('Failed to add vendor details:', state.error);
      })
      .addCase(updateVendorDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVendorDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.vendorDetails.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.vendorDetails)) {
            state.vendorDetails = [];
          }
          state.vendorDetails[index] = action.payload;
        }
      })
      .addCase(deleteVendorDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVendorDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.vendorDetails)) {
          state.vendorDetails = [];
        }
        state.vendorDetails = state.vendorDetails.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteVendorDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete vendor details';
        console.error('Failed to delete vendor details:', state.error);
      });
  },
});

export const vendorDetailsReducer = vendorDetailsSlice.reducer;