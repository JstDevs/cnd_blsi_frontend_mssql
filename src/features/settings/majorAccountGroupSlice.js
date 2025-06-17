import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialMajorAccountGroups = []

const initialState = {
  majorAccountGroups: initialMajorAccountGroups,
  majorAccountGroup: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls

export const fetchMajorAccountGroups = createAsyncThunk(
  'majorAccountGroups/fetchMajorAccountGroups',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/accountSubType`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();
      console.log('Fetched major account groups:', res);

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch major account groups');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addMajorAccountGroup = createAsyncThunk(
  'majorAccountGroups/addMajorAccountGroup',
  async (majorAccountGroup, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/accountSubType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(majorAccountGroup),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add major account group');
      }

      return res; // Return new major account group data from backend
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateMajorAccountGroup = createAsyncThunk(
  'majorAccountGroups/updateMajorAccountGroup',
  async (majorAccountGroup, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/accountSubType/${majorAccountGroup.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(majorAccountGroup),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update major account group');
      }

      return res; // Updated major account group from backend
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteMajorAccountGroup = createAsyncThunk(
  'majorAccountGroups/deleteMajorAccountGroup',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/accountSubType/${ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete major account group');
      }

      return ID; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const majorAccountGroupSlice = createSlice({
  name: 'majorAccountGroups',
  initialState,
  reducers: {
    setMajorAccountGroup: (state, action) => {
      state.majorAccountGroup = action.payload;
    },
    resetMajorAccountGroupState: (state) => {
      state.majorAccountGroup = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch major account groups
      .addCase(fetchMajorAccountGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMajorAccountGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.majorAccountGroups = action.payload;
        state.error = null;
      })
      .addCase(fetchMajorAccountGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add major account group
      .addCase(addMajorAccountGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addMajorAccountGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.majorAccountGroups.push(action.payload);
        state.error = null;
      })
      .addCase(addMajorAccountGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update major account group
      .addCase(updateMajorAccountGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMajorAccountGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.majorAccountGroups.findIndex(
          (majorAccountGroup) => majorAccountGroup.ID === action.payload.ID
        );
        if (index !== -1) {
          state.majorAccountGroups[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMajorAccountGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete major account group
      .addCase(deleteMajorAccountGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMajorAccountGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.majorAccountGroups = state.majorAccountGroups.filter(
          (majorAccountGroup) => majorAccountGroup.ID !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteMajorAccountGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setMajorAccountGroup, resetMajorAccountGroupState } = majorAccountGroupSlice.actions;

export default majorAccountGroupSlice.reducer;