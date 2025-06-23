import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialCurrency = [];

const initialState = {
  currencies: initialCurrency,
  currency: null,
  isLoading: false,
  error: null,
};

export const fetchCurrencies = createAsyncThunk(
  'currencies/fetchCurrencies',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/currency`, {
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

export const addCurrency = createAsyncThunk(
  'currencies/addCurrency',
  async (currency, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/currency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(currency),
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

export const updateCurrency = createAsyncThunk(
  'currencies/updateCurrency',
  async (currency, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/currency/${currency.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(currency),
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

export const deleteCurrency = createAsyncThunk(
  'currency/deleteCurrency',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/currency/${ID}`, {
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

const currencySlice = createSlice({
  name: 'currencies',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    resetCurrencyState: (state) => {
      state.currency = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch currencies
      .addCase(fetchCurrencies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currencies = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add currency
      .addCase(addCurrency.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currencies.push(action.payload);
        state.error = null;
      })
      .addCase(addCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update currency
      .addCase(updateCurrency.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.currencies.findIndex(
          (currency) => currency.ID === action.payload.ID
        );
        if (index !== -1) {
          state.currencies[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete currency
      .addCase(deleteCurrency.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currencies = state.currencies.filter(
          (currency) => currency.ID !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrency, resetCurrencyState } = currencySlice.actions;

export default currencySlice.reducer;