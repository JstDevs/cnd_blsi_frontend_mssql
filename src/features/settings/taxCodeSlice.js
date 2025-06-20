import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockTaxCodes = [];
export const fetchTaxCodes = createAsyncThunk(
  'taxCodes/fetchTaxCodes',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/taxCode`, {
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


export const addTaxCode = createAsyncThunk(
  'taxCodes/addTaxCode',
  async (taxCode, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/taxCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taxCode),
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

export const updateTaxCode = createAsyncThunk(
  'taxCodes/updateTaxCode',
  async (taxCode, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/taxCode/${taxCode.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(taxCode),
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

export const deleteTaxCode = createAsyncThunk(
  'taxCodes/deleteTaxCode',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/taxCode/${ID}`, {
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

const taxCodesSlice = createSlice({
  name: 'taxCodes',
  initialState: {
    taxCodes: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxCodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaxCodes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taxCodes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTaxCodes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tax codes';
        console.warn('Failed to fetch tax codes, using mock data.', state.error);
        state.taxCodes = mockTaxCodes;
      })
      .addCase(addTaxCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTaxCode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.taxCodes)) {
          state.taxCodes = [];
        }
        state.taxCodes.push(action.payload);
      })
      .addCase(addTaxCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add tax code';
        console.error('Failed to add tax code:', state.error);
      })
      .addCase(updateTaxCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTaxCode.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.taxCodes.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.taxCodes)) {
            state.taxCodes = [];
          }
          state.taxCodes[index] = action.payload;
        }
      })
      .addCase(deleteTaxCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTaxCode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.taxCodes)) {
          state.taxCodes = [];
        }
        state.taxCodes = state.taxCodes.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteTaxCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete tax code';
        console.error('Failed to delete tax code:', state.error);
      });
  },
});

export const taxCodesReducer = taxCodesSlice.reducer;