import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockProjectDetails = [];
export const fetchProjectDetails = createAsyncThunk(
  'projectDetails/fetchProjectDetails',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/project`, {
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


export const addProjectDetail = createAsyncThunk(
  'projectDetails/addProjectDetail',
  async (projectDetail, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(projectDetail),
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

export const updateProjectDetail = createAsyncThunk(
  'projectDetails/updateProjectDetail',
  async (projectDetail, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/project/${projectDetail.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(projectDetail),
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

export const deleteProjectDetail = createAsyncThunk(
  'projectDetails/deleteProjectDetail',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/project/${ID}`, {
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

const projectDetailsSlice = createSlice({
  name: 'projectDetails',
  initialState: {
    projectDetails: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projectDetails = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProjectDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch project details';
        console.warn('Failed to fetch project details, using mock data.', state.error);
        state.projectDetails = mockProjectDetails;
      })
      .addCase(addProjectDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProjectDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.projectDetails)) {
          state.projectDetails = [];
        }
        state.projectDetails.push(action.payload);
      })
      .addCase(addProjectDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add project detail';
        console.error('Failed to add project detail:', state.error);
      })
      .addCase(updateProjectDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProjectDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projectDetails.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.projectDetails)) {
            state.projectDetails = [];
          }
          state.projectDetails[index] = action.payload;
        }
      })
      .addCase(deleteProjectDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProjectDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.projectDetails)) {
          state.projectDetails = [];
        }
        state.projectDetails = state.projectDetails.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteProjectDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete project detail';
        console.error('Failed to delete project detail:', state.error);
      });
  },
});

export const projectDetailsReducer = projectDetailsSlice.reducer;