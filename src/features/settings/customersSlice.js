import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockCustomers = [];
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/customer`, {
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

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customer, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(customer),
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

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async (customer, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/customer/${customer.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(customer),
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

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/customer/${ID}`, {
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

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch customers';
        console.warn('Failed to fetch customer details, using mock data.', state.error);
        state.customers = mockCustomers; // Use mock data if fetch fails
      })
      .addCase(addCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.customers)) {
          state.customers = [];
        }
        state.customers.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add customer';
        console.error('Failed to add customer:', state.error);
      })
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.customers.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.customers)) {
            state.customers = [];
          }
          state.customers[index] = action.payload;
        }
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.customers)) {
          state.customers = [];
        }
        state.customers = state.customers.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete customer';
        console.error('Failed to delete customer:', state.error);
      });
  },
});

export const customersReducer = customersSlice.reducer;