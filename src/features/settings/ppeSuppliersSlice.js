import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockPpeSuppliers = [];
export const fetchPpeSuppliers = createAsyncThunk(
  'ppeSuppliers/fetchPpeSuppliers',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/ppeSupplier`, {
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

export const addPpeSupplier = createAsyncThunk(
  'ppeSuppliers/addPpeSupplier',
  async (ppeSupplier, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/ppeSupplier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(ppeSupplier),
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

export const updatePpeSupplier = createAsyncThunk(
  'ppeSuppliers/updatePpeSupplier',
  async (ppeSupplier, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/ppeSupplier/${ppeSupplier.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(ppeSupplier),
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

export const deletePpeSupplier = createAsyncThunk(
  'ppeSuppliers/deletePpeSupplier',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/ppeSupplier/${ID}`, {
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

const ppeSuppliersSlice = createSlice({
  name: 'ppeSuppliers',
  initialState: {
    ppeSuppliers: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPpeSuppliers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPpeSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ppeSuppliers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPpeSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch PPE suppliers';
        console.warn('Failed to fetch PPE suppliers, using mock data.', state.error);
        state.ppeSuppliers = mockPpeSuppliers;
      })
      .addCase(addPpeSupplier.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPpeSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.ppeSuppliers)) {
          state.ppeSuppliers = [];
        }
        state.ppeSuppliers.push(action.payload);
      })
      .addCase(addPpeSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add PPE supplier';
        console.error('Failed to add PPE supplier:', state.error);
      })
      .addCase(updatePpeSupplier.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePpeSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.ppeSuppliers.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.ppeSuppliers)) {
            state.ppeSuppliers = [];
          }
          state.ppeSuppliers[index] = action.payload;
        }
      })
      .addCase(deletePpeSupplier.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePpeSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.ppeSuppliers)) {
          state.ppeSuppliers = [];
        }
        state.ppeSuppliers = state.ppeSuppliers.filter(item => item.ID !== action.payload);
      })
      .addCase(deletePpeSupplier.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete PPE supplier';
        console.error('Failed to delete PPE supplier:', state.error);
      });
  },
});

export const ppeSuppliersReducer = ppeSuppliersSlice.reducer;