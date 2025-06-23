import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockItemUnits = [];
export const fetchItemUnits = createAsyncThunk(
  'itemUnits/fetchItemUnits',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/itemUnit`, {
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


export const addItemUnit = createAsyncThunk(
  'itemUnits/addItemUnit',
  async (itemUnit, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/itemUnit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(itemUnit),
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

export const updateItemUnit = createAsyncThunk(
  'itemUnits/updateItemUnit',
  async (itemUnit, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/itemUnit/${itemUnit.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(itemUnit),
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

export const deleteItemUnit = createAsyncThunk(
  'itemUnits/deleteItemUnit',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/itemUnit/${ID}`, {
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

const itemUnitsSlice = createSlice({
  name: 'itemUnits',
  initialState: {
    itemUnits: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemUnits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItemUnits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.itemUnits = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchItemUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch item units';
        console.warn('Failed to fetch item units, using mock data.', state.error);
        state.itemUnits = mockItemUnits;
      })
      .addCase(addItemUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.itemUnits)) {
          state.itemUnits = [];
        }
        state.itemUnits.push(action.payload);
      })
      .addCase(addItemUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add item unit';
        console.error('Failed to add item unit:', state.error);
      })
      .addCase(updateItemUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItemUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.itemUnits.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.itemUnits)) {
            state.itemUnits = [];
          }
          state.itemUnits[index] = action.payload;
        }
      })
      .addCase(deleteItemUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItemUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.itemUnits)) {
          state.itemUnits = [];
        }
        state.itemUnits = state.itemUnits.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteItemUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete item unit';
        console.error('Failed to delete item unit:', state.error);
      });
  },
});

export const itemUnitsReducer = itemUnitsSlice.reducer;