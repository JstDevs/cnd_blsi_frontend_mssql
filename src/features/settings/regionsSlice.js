import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockRegions = [];
export const fetchRegions = createAsyncThunk(
  'regions/fetchRegions',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/region`, {
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


export const addRegion = createAsyncThunk(
  'regions/addRegion',
  async (region, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/region`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(region),
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

export const updateRegion = createAsyncThunk(
  'regions/updateRegion',
  async (region, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/region/${region.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(region),
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

export const deleteRegion = createAsyncThunk(
  'regions/deleteRegion',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/region/${ID}`, {
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

const regionsSlice = createSlice({
  name: 'regions',
  initialState: {
    regions: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.regions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch regions';
        console.warn('Failed to fetch regions, using mock data.', state.error);
        state.regions = mockRegions;
      })
      .addCase(addRegion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.regions)) {
          state.regions = [];
        }
        state.regions.push(action.payload);
      })
      .addCase(addRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add region';
        console.error('Failed to add region:', state.error);
      })
      .addCase(updateRegion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.regions.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.regions)) {
            state.regions = [];
          }
          state.regions[index] = action.payload;
        }
      })
      .addCase(deleteRegion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRegion.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.regions)) {
          state.regions = [];
        }
        state.regions = state.regions.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete region';
        console.error('Failed to delete region:', state.error);
      });
  },
});

export const regionsReducer = regionsSlice.reducer;