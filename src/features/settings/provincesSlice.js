import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockProvinces = [];
export const fetchProvinces = createAsyncThunk(
  'provinces/fetchProvinces',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/province`, {
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


export const addProvince = createAsyncThunk(
  'provinces/addProvince',
  async (province, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/province`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(province),
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

export const updateProvince = createAsyncThunk(
  'provinces/updateProvince',
  async (province, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/province/${province.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(province),
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

export const deleteProvince = createAsyncThunk(
  'provinces/deleteProvince',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/province/${ID}`, {
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

const provincesSlice = createSlice({
  name: 'provinces',
  initialState: {
    provinces: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.provinces = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch provinces';
        console.warn('Failed to fetch provinces, using mock data.', state.error);
        state.provinces = mockProvinces;
      })
      .addCase(addProvince.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProvince.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.provinces)) {
          state.provinces = [];
        }
        state.provinces.push(action.payload);
      })
      .addCase(addProvince.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add province';
        console.error('Failed to add province:', state.error);
      })
      .addCase(updateProvince.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProvince.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.provinces.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.provinces)) {
            state.provinces = [];
          }
          state.provinces[index] = action.payload;
        }
      })
      .addCase(deleteProvince.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProvince.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.provinces)) {
          state.provinces = [];
        }
        state.provinces = state.provinces.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteProvince.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete province';
        console.error('Failed to delete province:', state.error);
      });
  },
});

export const provincesReducer = provincesSlice.reducer;