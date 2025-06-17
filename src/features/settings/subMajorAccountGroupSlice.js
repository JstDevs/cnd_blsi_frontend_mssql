import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialSubMajorAccountGroups = []

const initialState = {
  subMajorAccountGroups: initialSubMajorAccountGroups,
  subMajorAccountGroup: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls

export const fetchSubMajorAccountGroups = createAsyncThunk(
  'subMajorAccountGroups/fetchSubMajorAccountGroups',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/accountCategory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();
      console.log('Fetched sub major account groups:', res);

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch sub major account groups');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addSubMajorAccountGroup = createAsyncThunk(
  'subMajorAccountGroups/addSubMajorAccountGroup',
  async (subMajorAccountGroup, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/accountCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(subMajorAccountGroup),
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

export const updateSubMajorAccountGroup = createAsyncThunk(
  'subMajorAccountGroups/updateSubMajorAccountGroup',
  async (subMajorAccountGroup, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/accountCategory/${subMajorAccountGroup.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(subMajorAccountGroup),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update sub major account group');
      }

      return res; // Updated sub major account group from backend
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteSubMajorAccountGroup = createAsyncThunk(
  'subMajorAccountGroups/deleteSubMajorAccountGroup',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/accountCategory/${ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete sub major account group');
      }

      return ID; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const subMajorAccountGroupSlice = createSlice({
  name: 'subMajorAccountGroups',
  initialState,
  reducers: {
    setSubMajorAccountGroup: (state, action) => {
      state.subMajorAccountGroup = action.payload;
    },
    resetSubMajorAccountGroupState: (state) => {
      state.subMajorAccountGroup = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sub major account groups
      .addCase(fetchSubMajorAccountGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubMajorAccountGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subMajorAccountGroups = action.payload;
        state.error = null;
      })
      .addCase(fetchSubMajorAccountGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add sub major account group
      .addCase(addSubMajorAccountGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSubMajorAccountGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subMajorAccountGroups.push(action.payload);
        state.error = null;
      })
      .addCase(addSubMajorAccountGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update sub major account group
      .addCase(updateSubMajorAccountGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubMajorAccountGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subMajorAccountGroups.findIndex(
          (subMajorAccountGroup) => subMajorAccountGroup.ID === action.payload.ID
        );
        if (index !== -1) {
          state.subMajorAccountGroups[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSubMajorAccountGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete sub major account group
      .addCase(deleteSubMajorAccountGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubMajorAccountGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subMajorAccountGroups = state.subMajorAccountGroups.filter(
          (subMajorAccountGroup) => subMajorAccountGroup.ID !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteSubMajorAccountGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSubMajorAccountGroup, resetSubMajorAccountGroupState } = subMajorAccountGroupSlice.actions;

export default subMajorAccountGroupSlice.reducer;