import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockProjectTypes = [];
export const fetchProjectTypes = createAsyncThunk(
  'projectTypes/fetchProjectTypes',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/projectType`, {
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

export const addProjectType = createAsyncThunk(
  'projectTypes/addProjectType',
  async (projectType, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/projectType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(projectType),
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

export const updateProjectType = createAsyncThunk(
  'projectTypes/updateProjectType',
  async (projectType, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/projectType/${projectType.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(projectType),
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

export const deleteProjectType = createAsyncThunk(
  'projectTypes/deleteProjectType',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/projectType/${ID}`, {
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

const projectTypesSlice = createSlice({
  name: 'projectTypes',
  initialState: {
    projectTypes: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectTypes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProjectTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch project types';
        console.warn('Failed to fetch project types, using mock data.', state.error);
        state.projectTypes = mockProjectTypes;
      })
      .addCase(addProjectType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProjectType.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.projectTypes)) {
          state.projectTypes = [];
        }
        state.projectTypes.push(action.payload);
      })
      .addCase(addProjectType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add project type';
        console.error('Failed to add project type:', state.error);
      })
      .addCase(updateProjectType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProjectType.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projectTypes.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.projectTypes)) {
            state.projectTypes = [];
          }
          state.projectTypes[index] = action.payload;
        }
      })
      .addCase(deleteProjectType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProjectType.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.projectTypes)) {
          state.projectTypes = [];
        }
        state.projectTypes = state.projectTypes.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteProjectType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete project type';
        console.error('Failed to delete project type:', state.error);
      });
  },
});

export const projectTypesReducer = projectTypesSlice.reducer;