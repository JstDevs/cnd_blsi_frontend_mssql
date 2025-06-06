import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockProjectTypes = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'institutional', label: 'Institutional' },
];

const mockProjectDetails = [
  { 
    id: '1', 
    projectTitle: 'Green Oaks Housing', 
    startDate: '2023-01-15', 
    endDate: '2024-12-31', 
    projectType: 'residential', 
    description: 'Development of 50 residential units with community park.' 
  },
  { 
    id: '2', 
    projectTitle: 'Downtown Business Hub', 
    startDate: '2024-03-01', 
    endDate: '2025-06-30', 
    projectType: 'commercial', 
    description: 'Construction of a multi-story commercial building.' 
  },
];

// Async Thunks (Mock API calls)
export const fetchProjectDetails = createAsyncThunk('projectDetails/fetchProjectDetails', async () => {
  console.log('Mock API call: Fetching project details');
  return new Promise(resolve => setTimeout(() => resolve(mockProjectDetails), 500));
});

export const addProjectDetail = createAsyncThunk('projectDetails/addProjectDetail', async (projectDetail) => {
  console.log('Mock API call: Adding project detail', projectDetail);
  const newProjectDetail = { ...projectDetail, id: Date.now().toString() }; // Assign a mock ID
  return new Promise(resolve => setTimeout(() => resolve(newProjectDetail), 500));
});

export const updateProjectDetail = createAsyncThunk('projectDetails/updateProjectDetail', async (projectDetail) => {
  console.log('Mock API call: Updating project detail', projectDetail);
  return new Promise(resolve => setTimeout(() => resolve(projectDetail), 500));
});

export const deleteProjectDetail = createAsyncThunk('projectDetails/deleteProjectDetail', async (id) => {
  console.log('Mock API call: Deleting project detail with ID', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

const projectDetailsSlice = createSlice({
  name: 'projectDetails',
  initialState: {
    projectDetails: [],
    projectTypes: mockProjectTypes,
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
        const index = state.projectDetails.findIndex(detail => detail.id === action.payload.id);
        if (index !== -1) {
           if (!Array.isArray(state.projectDetails)) {
             state.projectDetails = [];
          }
          state.projectDetails[index] = action.payload;
        }
      })
      .addCase(updateProjectDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update project detail';
        console.error('Failed to update project detail:', state.error);
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
        state.projectDetails = state.projectDetails.filter(detail => detail.id !== action.payload);
      })
      .addCase(deleteProjectDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete project detail';
        console.error('Failed to delete project detail:', state.error);
      });
  },
});

export const projectDetailsReducer = projectDetailsSlice.reducer; 