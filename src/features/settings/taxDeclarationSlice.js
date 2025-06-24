import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockTaxDeclarations = [];
export const fetchTaxDeclarations = createAsyncThunk(
  'taxDeclarations/fetchTaxDeclarations',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/propertyTaxDeclaration`, {
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


export const addTaxDeclaration = createAsyncThunk(
  'taxDeclarations/addTaxDeclaration',
  async (taxDeclaration, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/propertyTaxDeclaration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taxDeclaration),
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

export const updateTaxDeclaration = createAsyncThunk(
  'taxDeclarations/updateTaxDeclaration',
  async (taxDeclaration, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/propertyTaxDeclaration/${taxDeclaration.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taxDeclaration),
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

export const deleteTaxDeclaration = createAsyncThunk(
  'taxDeclarations/deleteTaxDeclaration',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/propertyTaxDeclaration/${ID}`, {
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

const taxDeclarationsSlice = createSlice({
  name: 'taxDeclarations',
  initialState: {
    taxDeclarations: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxDeclarations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaxDeclarations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taxDeclarations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTaxDeclarations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tax declarations';
        console.warn('Failed to fetch tax declarations, using mock data.', state.error);
        state.taxDeclarations = mockTaxDeclarations;
      })
      .addCase(addTaxDeclaration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTaxDeclaration.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.taxDeclarations)) {
          state.taxDeclarations = [];
        }
        state.taxDeclarations.push(action.payload);
      })
      .addCase(addTaxDeclaration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add tax declaration';
        console.error('Failed to add tax declaration:', state.error);
      })
      .addCase(updateTaxDeclaration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTaxDeclaration.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.taxDeclarations.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.taxDeclarations)) {
            state.taxDeclarations = [];
          }
          state.taxDeclarations[index] = action.payload;
        }
      })
      .addCase(deleteTaxDeclaration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTaxDeclaration.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.taxDeclarations)) {
          state.taxDeclarations = [];
        }
        state.taxDeclarations = state.taxDeclarations.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteTaxDeclaration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete tax declaration';
        console.error('Failed to delete tax declaration:', state.error);
      });
  },
});

export const taxDeclarationsReducer = taxDeclarationsSlice.reducer;