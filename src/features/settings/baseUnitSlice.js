import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockBaseUnits = [];
export const fetchBaseUnits = createAsyncThunk(
  'baseUnits/fetchBaseUnits',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/scheduleofBaseunitMarketValue`, {
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


export const addBaseUnit = createAsyncThunk(
  'baseUnits/addBaseUnit',
  async (baseUnit, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/scheduleofBaseunitMarketValue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(baseUnit),
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

export const updateBaseUnit = createAsyncThunk(
  'baseUnits/updateBaseUnit',
  async (baseUnit, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/scheduleofBaseunitMarketValue/${baseUnit.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(baseUnit),
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

export const deleteBaseUnit = createAsyncThunk(
  'baseUnits/deleteBaseUnit',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/scheduleofBaseunitMarketValue/${ID}`, {
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

const baseUnitsSlice = createSlice({
  name: 'baseUnits',
  initialState: {
    baseUnits: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBaseUnits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBaseUnits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.baseUnits = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBaseUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch base units';
        console.warn('Failed to fetch base units, using mock data.', state.error);
        state.baseUnits = mockBaseUnits;
      })
      .addCase(addBaseUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBaseUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.baseUnits)) {
          state.baseUnits = [];
        }
        state.baseUnits.push(action.payload);
      })
      .addCase(addBaseUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add base unit';
        console.error('Failed to add base unit:', state.error);
      })
      .addCase(updateBaseUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBaseUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.baseUnits.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.baseUnits)) {
            state.baseUnits = [];
          }
          state.baseUnits[index] = action.payload;
        }
      })
      .addCase(deleteBaseUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBaseUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.baseUnits)) {
          state.baseUnits = [];
        }
        state.baseUnits = state.baseUnits.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteBaseUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete base unit';
        console.error('Failed to delete base unit:', state.error);
      });
  },
});

export const baseUnitsReducer = baseUnitsSlice.reducer;