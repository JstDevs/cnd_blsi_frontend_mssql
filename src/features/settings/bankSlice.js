import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialBanks = [];

const initialState = {
  banks: initialBanks,
  bank: null,
  isLoading: false,
  error: null,
};

export const fetchBanks = createAsyncThunk(
  'banks/fetchBanks',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/bank`, {
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

export const addBank = createAsyncThunk(
  'banks/addBank',
  async (bank, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/bank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bank),
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

export const updateBank = createAsyncThunk(
  'banks/updateBank',
  async (bank, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/bank/${bank.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bank),
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

export const deleteBank = createAsyncThunk(
  'bank/deleteBank',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/bank/${ID}`, {
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

const bankSlice = createSlice({
  name: 'banks',
  initialState,
  reducers: {
    setBank: (state, action) => {
      state.bank = action.payload;
    },
    resetBankState: (state) => {
      state.bank = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch banks
      .addCase(fetchBanks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banks = action.payload;
        state.error = null;
      })
      .addCase(fetchBanks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add bank
      .addCase(addBank.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banks.push(action.payload);
        state.error = null;
      })
      .addCase(addBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update bank
      .addCase(updateBank.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBank.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.banks.findIndex(
          (bank) => bank.ID === action.payload.ID
        );
        if (index !== -1) {
          state.banks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete bank
      .addCase(deleteBank.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banks = state.banks.filter(
          (bank) => bank.ID !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setBank, resetBankState } = bankSlice.actions;

export default bankSlice.reducer;