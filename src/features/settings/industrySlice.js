import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockIndustries = [
  { id: '1', code: 'TECH', name: 'Technology', industryType: 'Software' },
  { id: '2', code: 'FIN', name: 'Finance', industryType: 'Banking' },
  { id: '3', code: 'HEALTH', name: 'Healthcare', industryType: 'Pharmaceuticals' },
];

// Async Thunks (Mock API calls)
export const fetchIndustries = createAsyncThunk('industries/fetchIndustries', async () => {
  console.log('Mock API call: Fetching industries');
  return new Promise(resolve => setTimeout(() => resolve(mockIndustries), 500));
});

export const addIndustry = createAsyncThunk('industries/addIndustry', async (industry) => {
  console.log('Mock API call: Adding industry', industry);
  const newIndustry = { ...industry, id: Date.now().toString() }; // Assign a mock ID
  return new Promise(resolve => setTimeout(() => resolve(newIndustry), 500));
});

export const updateIndustry = createAsyncThunk('industries/updateIndustry', async (industry) => {
  console.log('Mock API call: Updating industry', industry);
  return new Promise(resolve => setTimeout(() => resolve(industry), 500));
});

export const deleteIndustry = createAsyncThunk('industries/deleteIndustry', async (id) => {
  console.log('Mock API call: Deleting industry with ID', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

const industriesSlice = createSlice({
  name: 'industries',
  initialState: {
    industries: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.industries = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch industries';
        console.warn('Failed to fetch industries, using mock data.', state.error);
        state.industries = mockIndustries;
      })
      .addCase(addIndustry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.industries)) {
          state.industries = [];
        }
        state.industries.push(action.payload);
      })
      .addCase(addIndustry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add industry';
        console.error('Failed to add industry:', state.error);
      })
      .addCase(updateIndustry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.industries.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
           if (!Array.isArray(state.industries)) {
             state.industries = [];
          }
          state.industries[index] = action.payload;
        }
      })
      .addCase(deleteIndustry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.industries)) {
          state.industries = [];
        }
        state.industries = state.industries.filter(item => item.id !== action.payload);
      })
      .addCase(deleteIndustry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete industry';
        console.error('Failed to delete industry:', state.error);
      });
  },
});

export const industryReducer = industriesSlice.reducer; 