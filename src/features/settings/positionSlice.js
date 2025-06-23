import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockPositions = [];
export const fetchPositions = createAsyncThunk(
  'positions/fetchPositions',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/position`, {
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


export const addPosition = createAsyncThunk(
  'positions/addPosition',
  async (position, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/position`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(position),
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

export const updatePosition = createAsyncThunk(
  'positions/updatePosition',
  async (position, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/position/${position.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(position),
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

// export const deletePositions = createAsyncThunk('positions/deletePosition', async (id) => {
//   console.log('Mock API call: Deleting position with ID', id);
//   return new Promise(resolve => setTimeout(() => resolve(id), 500));
// });

export const deletePosition = createAsyncThunk(
  'positions/deletePosition',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/position/${ID}`, {
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

const positionSlice = createSlice({
  name: 'positions',
  initialState: {
    positions: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.positions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch positions';
        console.warn('Failed to fetch positions, using mock data.', state.error);
        state.positions = mockPositions;
      })
      .addCase(addPosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPosition.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.positions)) {
          state.positions = [];
        }
        state.positions.push(action.payload);
      })
      .addCase(addPosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add position';
        console.error('Failed to add position:', state.error);
      })
      .addCase(updatePosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePosition.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.positions.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
           if (!Array.isArray(state.positions)) {
             state.positions = [];
          }
          state.positions[index] = action.payload;
        }
      })
      .addCase(deletePosition.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePosition.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.positions)) {
          state.positions = [];
        }
        state.positions = state.positions.filter(item => item.ID !== action.payload);
      })
      .addCase(deletePosition.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete position';
        console.error('Failed to delete position:', state.error);
      });
  },
});

export const positionReducer = positionSlice.reducer;