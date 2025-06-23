import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockModules = [];
export const fetchModules = createAsyncThunk(
  'modules/fetchModules',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/module`, {
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


export const addModule = createAsyncThunk(
  'modules/addModule',
  async (module, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/module`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(module),
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

export const updateModule = createAsyncThunk(
  'modules/updateModule',
  async (module, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/module/${module.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(module),
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

export const deleteModule = createAsyncThunk(
  'modules/deleteModule',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/module/${ID}`, {
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

const modulesSlice = createSlice({
  name: 'modules',
  initialState: {
    modules: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch modules';
        console.warn('Failed to fetch modules, using mock data.', state.error);
        state.modules = mockModules; // Use mock data if fetch fails
      })
      .addCase(addModule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addModule.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.modules)) {
          state.modules = [];
        }
        state.modules.push(action.payload);
      })
      .addCase(addModule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add module';
        console.error('Failed to add module:', state.error);
      })
      .addCase(updateModule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateModule.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.modules.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.modules)) {
            state.modules = [];
          }
          state.modules[index] = action.payload;
        }
      })
      .addCase(deleteModule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.modules)) {
          state.modules = [];
        }
        state.modules = state.modules.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete module';
        console.error('Failed to delete module:', state.error);
      });
  },
});

export const modulesReducer = modulesSlice.reducer;