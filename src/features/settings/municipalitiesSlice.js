import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockMunicipalities = [];
export const fetchMunicipalities = createAsyncThunk(
  'municipalities/fetchMunicipalities',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/municipality`, {
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

export const addMunicipality = createAsyncThunk(
  'municipalities/addMunicipality',
  async (municipality, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/municipality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(municipality),
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

export const updateMunicipality = createAsyncThunk(
  'municipalities/updateMunicipality',
  async (municipality, thunkAPI) => {
    try {
      const response = await fetch(
        `${API_URL}/municipality/${municipality.ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(municipality),
        }
      );

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

export const deleteMunicipality = createAsyncThunk(
  'municipalities/deleteMunicipality',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/municipality/${ID}`, {
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

const municipalitiesSlice = createSlice({
  name: 'municipalities',
  initialState: {
    municipalities: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMunicipalities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMunicipalities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.municipalities = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchMunicipalities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch municipalities';
        console.warn(
          'Failed to fetch municipalities, using mock data.',
          state.error
        );
        state.municipalities = mockMunicipalities;
      })
      .addCase(addMunicipality.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMunicipality.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.municipalities)) {
          state.municipalities = [];
        }
        state.municipalities.push(action.payload);
      })
      .addCase(addMunicipality.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add municipality';
        console.error('Failed to add municipality:', state.error);
      })
      .addCase(updateMunicipality.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMunicipality.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.municipalities.findIndex(
          (item) => item.ID === action.payload.ID
        );
        if (index !== -1) {
          if (!Array.isArray(state.municipalities)) {
            state.municipalities = [];
          }
          state.municipalities[index] = action.payload;
        }
      })
      .addCase(deleteMunicipality.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMunicipality.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.municipalities)) {
          state.municipalities = [];
        }
        state.municipalities = state.municipalities.filter(
          (item) => item.ID !== action.payload
        );
      })
      .addCase(deleteMunicipality.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete municipality';
        console.error('Failed to delete municipality:', state.error);
      });
  },
});

export const municipalitiesReducer = municipalitiesSlice.reducer;
