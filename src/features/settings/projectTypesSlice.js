import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockProjectTypes = [
  { id: 'pt1', code: 'RES', name: 'Residential' },
  { id: 'pt2', code: 'COM', name: 'Commercial' },
  { id: 'pt3', code: 'INF', name: 'Infrastructure' },
  { id: 'pt4', code: 'INS', name: 'Institutional' },
];

// Async Thunks (Mock API calls)
export const fetchProjectTypes = createAsyncThunk('projectTypes/fetchProjectTypes', async () => {
  console.log('Mock API call: Fetching project types');
  return new Promise(resolve => setTimeout(() => resolve(mockProjectTypes), 500));
});

export const addProjectType = createAsyncThunk('projectTypes/addProjectType', async (projectType) => {
  console.log('Mock API call: Adding project type', projectType);
  const newProjectType = { ...projectType, id: Date.now().toString() }; // Assign a mock ID
  return new Promise(resolve => setTimeout(() => resolve(newProjectType), 500));
});

export const updateProjectType = createAsyncThunk('projectTypes/updateProjectType', async (projectType) => {
  console.log('Mock API call: Updating project type', projectType);
  return new Promise(resolve => setTimeout(() => resolve(projectType), 500));
});

export const deleteProjectType = createAsyncThunk('projectTypes/deleteProjectType', async (id) => {
  console.log('Mock API call: Deleting project type with ID', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

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
        const index = state.projectTypes.findIndex(type => type.id === action.payload.id);
        if (index !== -1) {
           if (!Array.isArray(state.projectTypes)) {
             state.projectTypes = [];
          }
          state.projectTypes[index] = action.payload;
        }
      })
      .addCase(updateProjectType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update project type';
        console.error('Failed to update project type:', state.error);
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
        state.projectTypes = state.projectTypes.filter(type => type.id !== action.payload);
      })
      .addCase(deleteProjectType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete project type';
        console.error('Failed to delete project type:', state.error);
      });
  },
});

export const projectTypesReducer = projectTypesSlice.reducer; 