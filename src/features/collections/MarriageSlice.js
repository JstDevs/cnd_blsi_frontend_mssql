import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockMarriageRecords = [];

export const fetchMarriageRecords = createAsyncThunk(
  'marriageRecords/fetchMarriageRecords',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/marriagerecord`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch marriage records');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchMarriageRecordById = createAsyncThunk(
  'marriageRecords/fetchMarriageRecordById',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/marriagerecord/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch marriage record');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addMarriageRecord = createAsyncThunk(
  'marriageRecords/addMarriageRecord',
  async (marriagerecord, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/marriagerecord`, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: marriagerecord,
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add marriage record');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateMarriageRecord = createAsyncThunk(
  'marriageRecords/updateMarriageRecord',
  async (marriagerecord, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/marriagerecord/${marriagerecord.ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(marriagerecord),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update marriage record');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteMarriageRecord = createAsyncThunk(
  'marriageRecords/deleteMarriageRecord',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/marriagerecord/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to delete marriage record'
        );
      }

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const marriageRecordsSlice = createSlice({
  name: 'marriageRecords',
  initialState: {
    records: [],
    currentRecord: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarriageRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarriageRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMarriageRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch marriage records';
        console.warn(
          'Failed to fetch marriage records, using mock data.',
          state.error
        );
        state.records = mockMarriageRecords;
      })
      .addCase(fetchMarriageRecordById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMarriageRecordById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchMarriageRecordById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch marriage record';
      })
      .addCase(addMarriageRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMarriageRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.records)) {
          state.records = [];
        }
        state.records.push(action.payload);
      })
      .addCase(addMarriageRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add marriage record';
        console.error('Failed to add marriage record:', state.error);
      })
      .addCase(updateMarriageRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMarriageRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.records.findIndex(
          (item) => item.ID === action.payload.ID
        );
        if (index !== -1) {
          if (!Array.isArray(state.records)) {
            state.records = [];
          }
          state.records[index] = action.payload;
        }
        if (
          state.currentRecord &&
          state.currentRecord.ID === action.payload.ID
        ) {
          state.currentRecord = action.payload;
        }
      })
      .addCase(updateMarriageRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update marriage record';
        console.error('Failed to update marriage record:', state.error);
      })
      .addCase(deleteMarriageRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMarriageRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.records)) {
          state.records = [];
        }
        state.records = state.records.filter(
          (item) => item.ID !== action.payload
        );
        if (state.currentRecord && state.currentRecord.ID === action.payload) {
          state.currentRecord = null;
        }
      })
      .addCase(deleteMarriageRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete marriage record';
        console.error('Failed to delete marriage record:', state.error);
      });
  },
});

export const { clearCurrentRecord } = marriageRecordsSlice.actions;
export const marriageRecordsReducer = marriageRecordsSlice.reducer;
