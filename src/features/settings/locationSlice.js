import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data (can be replaced with API calls later)
const mockLocations = [
  { id: '1', name: 'Main Office', code: 'MO' },
  { id: '2', name: 'Branch A', code: 'BA' },
  { id: '3', name: 'Warehouse 1', code: 'W1' },
];

const initialState = {
  locations: [],
  isLoading: false,
  error: null,
};

// Async thunks (placeholder for API calls)
export const fetchLocations = createAsyncThunk(
  'locations/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      // const response = await api.get('/api/locations');
      // return response.data;
      
      // Simulating API delay and returning mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockLocations;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Add, update, delete thunks can be added here following similar patterns

const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    // Define reducers for synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { /* synchronous actions here */ } = locationSlice.actions;

export default locationSlice.reducer; 