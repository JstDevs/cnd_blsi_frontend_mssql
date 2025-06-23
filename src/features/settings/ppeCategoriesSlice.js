import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockPpeCategories = [];
export const fetchPpeCategories = createAsyncThunk(
  'ppeCategories/fetchPpeCategories',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/ppeCategory`, {
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

export const addPpeCategory = createAsyncThunk(
  'ppeCategories/addPpeCategory',
  async (ppeCategory, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/ppeCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(ppeCategory),
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

export const updatePpeCategory = createAsyncThunk(
  'ppeCategories/updatePpeCategory',
  async (ppeCategory, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/ppeCategory/${ppeCategory.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(ppeCategory),
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

export const deletePpeCategory = createAsyncThunk(
  'ppeCategories/deletePpeCategory',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/ppeCategory/${ID}`, {
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

const ppeCategoriesSlice = createSlice({
  name: 'ppeCategories',
  initialState: {
    ppeCategories: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPpeCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPpeCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ppeCategories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPpeCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch PPE categories';
        console.warn('Failed to fetch PPE categories, using mock data.', state.error);
        state.ppeCategories = mockPpeCategories;
      })
      .addCase(addPpeCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPpeCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.ppeCategories)) {
          state.ppeCategories = [];
        }
        state.ppeCategories.push(action.payload);
      })
      .addCase(addPpeCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add PPE category';
        console.error('Failed to add PPE category:', state.error);
      })
      .addCase(updatePpeCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePpeCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.ppeCategories.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.ppeCategories)) {
            state.ppeCategories = [];
          }
          state.ppeCategories[index] = action.payload;
        }
      })
      .addCase(deletePpeCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePpeCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.ppeCategories)) {
          state.ppeCategories = [];
        }
        state.ppeCategories = state.ppeCategories.filter(item => item.ID !== action.payload);
      })
      .addCase(deletePpeCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete PPE category';
        console.error('Failed to delete PPE category:', state.error);
      });
  },
});

export const ppeCategoriesReducer = ppeCategoriesSlice.reducer;