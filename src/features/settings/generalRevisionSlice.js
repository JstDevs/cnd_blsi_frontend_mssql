import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockGeneralRevisions = [];
export const fetchGeneralRevisions = createAsyncThunk(
  'generalRevisions/fetchGeneralRevisions',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/generalRevision`, {
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


export const addGeneralRevision = createAsyncThunk(
  'generalRevisions/addGeneralRevision',
  async (generalRevision, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/generalRevision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(generalRevision),
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

export const updateGeneralRevision = createAsyncThunk(
  'generalRevisions/updateGeneralRevision',
  async (generalRevision, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/generalRevision/${generalRevision.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(generalRevision),
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

export const deleteGeneralRevision = createAsyncThunk(
  'generalRevisions/deleteGeneralRevision',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/generalRevision/${ID}`, {
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

const generalRevisionsSlice = createSlice({
  name: 'generalRevisions',
  initialState: {
    generalRevisions: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralRevisions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneralRevisions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalRevisions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGeneralRevisions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch general revisions';
        console.warn('Failed to fetch general revisions, using mock data.', state.error);
        state.generalRevisions = mockGeneralRevisions;
      })
      .addCase(addGeneralRevision.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addGeneralRevision.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.generalRevisions)) {
          state.generalRevisions = [];
        }
        state.generalRevisions.push(action.payload);
      })
      .addCase(addGeneralRevision.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add general revision';
        console.error('Failed to add general revision:', state.error);
      })
      .addCase(updateGeneralRevision.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGeneralRevision.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.generalRevisions.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.generalRevisions)) {
            state.generalRevisions = [];
          }
          state.generalRevisions[index] = action.payload;
        }
      })
      .addCase(deleteGeneralRevision.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGeneralRevision.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.generalRevisions)) {
          state.generalRevisions = [];
        }
        state.generalRevisions = state.generalRevisions.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteGeneralRevision.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete general revision';
        console.error('Failed to delete general revision:', state.error);
      });
  },
});

export const generalRevisionsReducer = generalRevisionsSlice.reducer;