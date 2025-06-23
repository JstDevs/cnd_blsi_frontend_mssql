import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialApprovalMatrix = [];

const initialState = {
  approvalMatrix: initialApprovalMatrix,
  matrix: null,
  isLoading: false,
  error: null,
};


export const fetchApprovalMatrix = createAsyncThunk(
  'approvalMatrix/fetchApprovalMatrix',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/approvalMatrix`, {
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


export const addApprovalMatrix = createAsyncThunk(
  'approvalMatrix/addApprovalMatrix',
  async (matrix, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/approvalMatrix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(matrix),
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

export const updateApprovalMatrix = createAsyncThunk(
  'approvalMatrix/updateApprovalMatrix',
  async (matrix, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/approvalMatrix/${matrix.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(matrix),
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

export const deleteApprovalMatrix = createAsyncThunk(
  'approvalMatrix/deleteApprovalMatrix',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/approvalMatrix/${ID}`, {
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

const approvalMatrixSlice = createSlice({
  name: 'approvalMatrix',
  initialState,
  reducers: {
    setMatrix: (state, action) => {
      state.matrix = action.payload;
    },
    resetMatrixState: (state) => {
      state.matrix = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovalMatrix.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchApprovalMatrix.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalMatrix = action.payload;
        state.error = null;
      })
      .addCase(fetchApprovalMatrix.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addApprovalMatrix.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addApprovalMatrix.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalMatrix.push(action.payload);
        state.error = null;
      })
      .addCase(addApprovalMatrix.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateApprovalMatrix.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateApprovalMatrix.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.approvalMatrix.findIndex((m) => m.ID === action.payload.ID);
        if (index !== -1) {
          state.approvalMatrix[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateApprovalMatrix.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteApprovalMatrix.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteApprovalMatrix.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalMatrix = state.approvalMatrix.filter((m) => m.ID !== action.payload);
        state.error = null;
      })
      .addCase(deleteApprovalMatrix.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setMatrix, resetMatrixState } = approvalMatrixSlice.actions;
export default approvalMatrixSlice.reducer; 