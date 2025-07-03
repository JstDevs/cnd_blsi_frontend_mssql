import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialPurchaseRequests = [];

const initialState = {
  purchaseRequests: initialPurchaseRequests,
  isLoading: false,
  error: null,
};


export const fetchPurchaseRequests = createAsyncThunk(
  'purchaseRequests/fetchPurchaseRequests',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/purchaseRequest`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to fetch');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const addPurchaseRequest = createAsyncThunk(
  'purchaseRequests/addPurchaseRequest',
  async (purchaseRequest, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/purchaseRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(purchaseRequest),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePurchaseRequest = createAsyncThunk(
  'purchaseRequests/updatePurchaseRequest',
  async (purchaseRequest, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/purchaseRequest/${purchaseRequest.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(purchaseRequest),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to update');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deletePurchaseRequest = createAsyncThunk(
  'purchaseRequests/deletePurchaseRequest',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/purchaseRequest/${ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to delete');
      }

      return ID;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const purchaseRequestSlice = createSlice({
  name: 'purchaseRequests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPurchaseRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchaseRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchPurchaseRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addPurchaseRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPurchaseRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchaseRequests.push(action.payload);
        state.error = null;
      })
      .addCase(addPurchaseRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePurchaseRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePurchaseRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.purchaseRequests.findIndex((pr) => pr.ID === action.payload.ID);
        if (index !== -1) {
          state.purchaseRequests[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePurchaseRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deletePurchaseRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePurchaseRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchaseRequests = state.purchaseRequests.filter((pr) => pr.ID !== action.payload);
        state.error = null;
      })
      .addCase(deletePurchaseRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const purchaseRequestReducer = purchaseRequestSlice.reducer;