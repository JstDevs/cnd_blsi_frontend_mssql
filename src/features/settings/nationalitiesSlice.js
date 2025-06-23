import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockNationalities = [];
export const fetchNationalities = createAsyncThunk(
  'nationalities/fetchNationalities',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/nationality`, {
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


export const addNationality = createAsyncThunk(
  'nationalities/addNationality',
  async (nationality, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/nationality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(nationality),
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

export const updateNationality = createAsyncThunk(
  'nationalities/updateNationality',
  async (nationality, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/nationality/${nationality.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(nationality),
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

export const deleteNationality = createAsyncThunk(
  'nationalities/deleteNationality',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/nationality/${ID}`, {
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

const nationalitySlice = createSlice({
  name: 'nationalities',
  initialState: {
    nationalities: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNationalities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNationalities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nationalities = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchNationalities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch nationalities';
        console.warn('Failed to fetch nationalities, using mock data.', state.error);
        state.nationalities = mockNationalities;
      })
      .addCase(addNationality.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNationality.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.nationalities)) {
          state.nationalities = [];
        }
        state.nationalities.push(action.payload);
      })
      .addCase(addNationality.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add nationality';
        console.error('Failed to add nationality:', state.error);
      })
      .addCase(updateNationality.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNationality.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.nationalities.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.nationalities)) {
            state.nationalities = [];
          }
          state.nationalities[index] = action.payload;
        }
      })
      .addCase(deleteNationality.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNationality.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.nationalities)) {
          state.nationalities = [];
        }
        state.nationalities = state.nationalities.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteNationality.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete nationality';
        console.error('Failed to delete nationality:', state.error);
      });
  },
});

export const nationalityReducer = nationalitySlice.reducer;