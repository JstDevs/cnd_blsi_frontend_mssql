import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockIndustries = [];
export const fetchIndustries = createAsyncThunk(
  'industries/fetchIndustries',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/industryType`, {
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


export const addIndustry = createAsyncThunk(
  'industries/addIndustry',
  async (industry, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/industryType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(industry),
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

export const updateIndustry = createAsyncThunk(
  'industries/updateIndustry',
  async (industry, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/industryType/${industry.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(industry),
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

export const deleteIndustry = createAsyncThunk(
  'industries/deleteIndustry',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/industryType/${ID}`, {
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

const industriesSlice = createSlice({
  name: 'industries',
  initialState: {
    industries: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.industries = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch industries';
        console.warn('Failed to fetch industries, using mock data.', state.error);
        state.industries = mockIndustries;
      })
      .addCase(addIndustry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.industries)) {
          state.industries = [];
        }
        state.industries.push(action.payload);
      })
      .addCase(addIndustry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add industry';
        console.error('Failed to add industry:', state.error);
      })
      .addCase(updateIndustry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.industries.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.industries)) {
            state.industries = [];
          }
          state.industries[index] = action.payload;
        }
      })
      .addCase(deleteIndustry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.industries)) {
          state.industries = [];
        }
        state.industries = state.industries.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteIndustry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete industry';
        console.error('Failed to delete industry:', state.error);
      });
  },
});

export const industriesReducer = industriesSlice.reducer;