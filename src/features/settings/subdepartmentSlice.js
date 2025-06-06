import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialSubdepartments = [
  { 
    id: 1, 
    subdepartmentCode: "MAYOR-ADM", 
    subdepartmentName: "Administrative Division", 
    departmentId: 1,
    departmentName: "Office of the Mayor",
    description: "Handles administrative matters for the Mayor's Office", 
    status: "Active" 
  },
  { 
    id: 2, 
    subdepartmentCode: "ACCTG-AP", 
    subdepartmentName: "Accounts Payable Section", 
    departmentId: 2,
    departmentName: "Accounting Department",
    description: "Processes vendor payments and disbursements", 
    status: "Active" 
  },
  { 
    id: 3, 
    subdepartmentCode: "ACCTG-AR", 
    subdepartmentName: "Accounts Receivable Section", 
    departmentId: 2,
    departmentName: "Accounting Department",
    description: "Handles billing and collections", 
    status: "Active" 
  },
  { 
    id: 4, 
    subdepartmentCode: "IT-APPS", 
    subdepartmentName: "Applications Development", 
    departmentId: 4,
    departmentName: "Information Technology Department",
    description: "Develops and maintains software applications", 
    status: "Active" 
  },
];

const initialState = {
  subdepartments: initialSubdepartments,
  subdepartment: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchSubdepartments = createAsyncThunk(
  'subdepartments/fetchSubdepartments',
  async (_, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialSubdepartments);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addSubdepartment = createAsyncThunk(
  'subdepartments/addSubdepartment',
  async (subdepartment, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newSubdepartment = {
            ...subdepartment,
            id: Date.now(),
            status: subdepartment.status || 'Active',
          };
          resolve(newSubdepartment);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateSubdepartment = createAsyncThunk(
  'subdepartments/updateSubdepartment',
  async (subdepartment, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(subdepartment);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteSubdepartment = createAsyncThunk(
  'subdepartments/deleteSubdepartment',
  async (id, thunkAPI) => {
    try {
      // Simulate API call
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

const subdepartmentSlice = createSlice({
  name: 'subdepartments',
  initialState,
  reducers: {
    setSubdepartment: (state, action) => {
      state.subdepartment = action.payload;
    },
    resetSubdepartmentState: (state) => {
      state.subdepartment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subdepartments
      .addCase(fetchSubdepartments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubdepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subdepartments = action.payload;
        state.error = null;
      })
      .addCase(fetchSubdepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add subdepartment
      .addCase(addSubdepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSubdepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subdepartments.push(action.payload);
        state.error = null;
      })
      .addCase(addSubdepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update subdepartment
      .addCase(updateSubdepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSubdepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subdepartments.findIndex(
          (subdepartment) => subdepartment.id === action.payload.id
        );
        if (index !== -1) {
          state.subdepartments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateSubdepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete subdepartment
      .addCase(deleteSubdepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubdepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subdepartments = state.subdepartments.filter(
          (subdepartment) => subdepartment.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteSubdepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSubdepartment, resetSubdepartmentState } = subdepartmentSlice.actions;

export default subdepartmentSlice.reducer;