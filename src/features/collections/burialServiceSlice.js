import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockBurialRecords = [];

export const fetchBurialRecords = createAsyncThunk(
  'burialRecords/fetchBurialRecords',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/burialrecord`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch burial records');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchBurialRecordById = createAsyncThunk(
  'burialRecords/fetchBurialRecordById',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/burialrecord/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch burial record');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addBurialRecord = createAsyncThunk(
  'burialRecords/addBurialRecord',
  async (burialrecord, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/burialrecord`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: burialrecord,
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add burial record');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateBurialRecord = createAsyncThunk(
  'burialRecords/updateBurialRecord',
  async (burialrecord, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/burialrecord/${burialrecord.ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(burialrecord),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update burial record');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteBurialRecord = createAsyncThunk(
  'burialRecords/deleteBurialRecord',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/burialrecord/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete burial record');
      }

      return id; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const burialRecordsSlice = createSlice({
  name: 'burialRecords',
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
      .addCase(fetchBurialRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBurialRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBurialRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch burial records';
        console.warn(
          'Failed to fetch burial records, using mock data.',
          state.error
        );
        state.records = mockBurialRecords;
      })
      .addCase(fetchBurialRecordById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBurialRecordById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchBurialRecordById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch burial record';
      })
      .addCase(addBurialRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBurialRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.records)) {
          state.records = [];
        }
        state.records.push(action.payload);
      })
      .addCase(addBurialRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add burial record';
        console.error('Failed to add burial record:', state.error);
      })
      .addCase(updateBurialRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBurialRecord.fulfilled, (state, action) => {
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
      .addCase(updateBurialRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update burial record';
        console.error('Failed to update burial record:', state.error);
      })
      .addCase(deleteBurialRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBurialRecord.fulfilled, (state, action) => {
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
      .addCase(deleteBurialRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete burial record';
        console.error('Failed to delete burial record:', state.error);
      });
  },
});

export const { clearCurrentRecord } = burialRecordsSlice.actions;
export const burialRecordsReducer = burialRecordsSlice.reducer;
