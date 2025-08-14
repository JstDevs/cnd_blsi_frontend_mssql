import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchRecords = createAsyncThunk(
  'communityTax/fetchRecords',
  async () => {
    const response = await axios.get('/api/community-tax');
    return response.data;
  }
);

export const createRecord = createAsyncThunk(
  'communityTax/createRecord',
  async (record) => {
    const response = await axios.post('/api/community-tax', record);
    return response.data;
  }
);

export const updateRecord = createAsyncThunk(
  'communityTax/updateRecord',
  async ({ id, ...record }) => {
    const response = await axios.put(`/api/community-tax/${id}`, record);
    return response.data;
  }
);

export const deleteRecord = createAsyncThunk(
  'communityTax/deleteRecord',
  async (id) => {
    await axios.delete(`/api/community-tax/${id}`);
    return id;
  }
);

const initialState = {
  records: [],
  loading: false,
  error: null,
};

const communityTaxSlice = createSlice({
  name: 'communityTax',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch records
      .addCase(fetchRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create record
      .addCase(createRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records.push(action.payload);
      })
      .addCase(createRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update record
      .addCase(updateRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.records.findIndex(record => record.id === action.payload.id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      })
      .addCase(updateRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Delete record
      .addCase(deleteRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.records = state.records.filter(record => record.id !== action.payload);
      })
      .addCase(deleteRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = communityTaxSlice.actions;
export default communityTaxSlice.reducer; 