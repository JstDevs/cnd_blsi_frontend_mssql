import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialApprovalMatrix = [
  {
    id: 1,
    documentType: 'Purchase Request',
    sequenceLevel: 'Level 1',
    approverType: 'Position',
    approver: 'Department Head',
    amountFrom: 0,
    amountTo: 10000,
    approvalRule: 'ALL',
  },
];

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
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialApprovalMatrix);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addApprovalMatrix = createAsyncThunk(
  'approvalMatrix/addApprovalMatrix',
  async (matrix, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newMatrix = { ...matrix, id: Date.now() };
          resolve(newMatrix);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateApprovalMatrix = createAsyncThunk(
  'approvalMatrix/updateApprovalMatrix',
  async (matrix, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(matrix);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteApprovalMatrix = createAsyncThunk(
  'approvalMatrix/deleteApprovalMatrix',
  async (id, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(id);
        }, 500);
      });
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
        const index = state.approvalMatrix.findIndex((m) => m.id === action.payload.id);
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
        state.approvalMatrix = state.approvalMatrix.filter((m) => m.id !== action.payload);
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