import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockCommunityTaxes = [];

export const fetchCommunityTaxes = createAsyncThunk(
  'communityTax/fetchCommunityTaxes',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/community-tax/getall`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch community taxes');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCommunityTaxById = createAsyncThunk(
  'communityTax/fetchCommunityTaxById',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/community-tax/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch community tax record');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addCommunityTax = createAsyncThunk(
  'communityTax/addCommunityTax',
  async (communityTax, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/community-tax/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(communityTax),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add community tax record');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateCommunityTax = createAsyncThunk(
  'communityTax/updateCommunityTax',
  async (communityTax, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/community-tax/${communityTax.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(communityTax),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update community tax record');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteCommunityTax = createAsyncThunk(
  'communityTax/deleteCommunityTax',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/community-tax/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to delete community tax record'
        );
      }

      return id; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const communityTaxSlice = createSlice({
  name: 'communityTax',
  initialState: {
    records: [],
    currentRecord: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentCommunityTax: (state) => {
      state.currentRecord = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunityTaxes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCommunityTaxes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCommunityTaxes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch community taxes';
        console.warn(
          'Failed to fetch community taxes, using mock data.',
          state.error
        );
        state.records = mockCommunityTaxes;
      })
      .addCase(fetchCommunityTaxById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCommunityTaxById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchCommunityTaxById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch community tax record';
      })
      .addCase(addCommunityTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCommunityTax.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.records)) {
          state.records = [];
        }
        state.records.push(action.payload);
      })
      .addCase(addCommunityTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add community tax record';
        console.error('Failed to add community tax record:', state.error);
      })
      .addCase(updateCommunityTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCommunityTax.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.records.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          if (!Array.isArray(state.records)) {
            state.records = [];
          }
          state.records[index] = action.payload;
        }
        if (
          state.currentRecord &&
          state.currentRecord.id === action.payload.id
        ) {
          state.currentRecord = action.payload;
        }
      })
      .addCase(updateCommunityTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update community tax record';
        console.error('Failed to update community tax record:', state.error);
      })
      .addCase(deleteCommunityTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCommunityTax.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.records)) {
          state.records = [];
        }
        state.records = state.records.filter(
          (item) => item.id !== action.payload
        );
        if (state.currentRecord && state.currentRecord.id === action.payload) {
          state.currentRecord = null;
        }
      })
      .addCase(deleteCommunityTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete community tax record';
        console.error('Failed to delete community tax record:', state.error);
      });
  },
});

export const { clearCurrentCommunityTax } = communityTaxSlice.actions;
export const communityTaxReducer = communityTaxSlice.reducer;
