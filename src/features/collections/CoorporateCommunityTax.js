import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockCorporateCommunityTaxes = [];

export const fetchCorporateCommunityTaxes = createAsyncThunk(
  'corporateCommunityTax/fetchCorporateCommunityTaxes',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/corporate-ctc/getall`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(
          res.message || 'Failed to fetch corporate community taxes'
        );
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCorporateCommunityTaxById = createAsyncThunk(
  'corporateCommunityTax/fetchCorporateCommunityTaxById',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/corporate-ctc/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(
          res.message || 'Failed to fetch corporate community tax record'
        );
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addCorporateCommunityTax = createAsyncThunk(
  'corporateCommunityTax/addCorporateCommunityTax',
  async (corporateCommunityTax, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/corporate-ctc/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(corporateCommunityTax),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(
          res.message || 'Failed to add corporate community tax record'
        );
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateCorporateCommunityTax = createAsyncThunk(
  'corporateCommunityTax/updateCorporateCommunityTax',
  async (corporateCommunityTax, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/corporate-ctc/${corporateCommunityTax.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(corporateCommunityTax),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(
          res.message || 'Failed to update corporate community tax record'
        );
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteCorporateCommunityTax = createAsyncThunk(
  'corporateCommunityTax/deleteCorporateCommunityTax',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/corporate-ctc/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to delete corporate community tax record'
        );
      }

      return id; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const corporateCommunityTaxSlice = createSlice({
  name: 'corporateCommunityTax',
  initialState: {
    records: [],
    currentRecord: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentCorporateCommunityTax: (state) => {
      state.currentRecord = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCorporateCommunityTaxes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCorporateCommunityTaxes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCorporateCommunityTaxes.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to fetch corporate community taxes';
        console.warn(
          'Failed to fetch corporate community taxes, using mock data.',
          state.error
        );
        state.records = mockCorporateCommunityTaxes;
      })
      .addCase(fetchCorporateCommunityTaxById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCorporateCommunityTaxById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchCorporateCommunityTaxById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to fetch corporate community tax record';
      })
      .addCase(addCorporateCommunityTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCorporateCommunityTax.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.records)) {
          state.records = [];
        }
        state.records.push(action.payload);
      })
      .addCase(addCorporateCommunityTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to add corporate community tax record';
        console.error(
          'Failed to add corporate community tax record:',
          state.error
        );
      })
      .addCase(updateCorporateCommunityTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCorporateCommunityTax.fulfilled, (state, action) => {
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
      .addCase(updateCorporateCommunityTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to update corporate community tax record';
        console.error(
          'Failed to update corporate community tax record:',
          state.error
        );
      })
      .addCase(deleteCorporateCommunityTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCorporateCommunityTax.fulfilled, (state, action) => {
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
      .addCase(deleteCorporateCommunityTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Failed to delete corporate community tax record';
        console.error(
          'Failed to delete corporate community tax record:',
          state.error
        );
      });
  },
});

export const { clearCurrentCorporateCommunityTax } =
  corporateCommunityTaxSlice.actions;
export const corporateCommunityTaxReducer = corporateCommunityTaxSlice.reducer;
