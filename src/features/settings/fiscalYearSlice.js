import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockFiscalYears = [];
export const fetchFiscalYears = createAsyncThunk(
  'fiscalYears/fetchFiscalYears',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/fiscalYear`, {
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


export const addFiscalYear = createAsyncThunk(
  'fiscalYears/addFiscalYear',
  async (fiscalYear, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/fiscalYear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(fiscalYear),
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

export const updateFiscalYear = createAsyncThunk(
  'fiscalYears/updateFiscalYear',
  async (fiscalYear, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/fiscalYear/${fiscalYear.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(fiscalYear),
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

export const deleteFiscalYear = createAsyncThunk(
  'fiscalYears/deleteFiscalYear',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/fiscalYear/${ID}`, {
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

const fiscalYearsSlice = createSlice({
  name: 'fiscalYears',
  initialState: {
    fiscalYears: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiscalYears.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFiscalYears.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fiscalYears = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFiscalYears.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch fiscal years';
        console.warn('Failed to fetch fiscal years, using mock data.', state.error);
        state.fiscalYears = mockFiscalYears;
      })
      .addCase(addFiscalYear.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFiscalYear.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.fiscalYears)) {
          state.fiscalYears = [];
        }
        state.fiscalYears.push(action.payload);
      })
      .addCase(addFiscalYear.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add fiscal year';
        console.error('Failed to add fiscal year:', state.error);
      })
      .addCase(updateFiscalYear.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFiscalYear.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.fiscalYears.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          if (!Array.isArray(state.fiscalYears)) {
            state.fiscalYears = [];
          }
          state.fiscalYears[index] = action.payload;
        }
      })
      .addCase(deleteFiscalYear.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFiscalYear.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.fiscalYears)) {
          state.fiscalYears = [];
        }
        state.fiscalYears = state.fiscalYears.filter(item => item.id !== action.payload);
      })
      .addCase(deleteFiscalYear.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete fiscal year';
        console.error('Failed to delete fiscal year:', state.error);
      });
  },
});

export const fiscalYearsReducer = fiscalYearsSlice.reducer;