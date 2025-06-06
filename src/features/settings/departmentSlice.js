import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialDepartments = [
  { 
    id: 1, 
    departmentCode: "MAYOR", 
    departmentName: "Office of the Mayor", 
    description: "The executive office of the LGU", 
    headOfDepartment: "Mayor John Santos",
    status: "Active" 
  },
  { 
    id: 2, 
    departmentCode: "ACCTG", 
    departmentName: "Accounting Department", 
    description: "Handles financial records and reporting", 
    headOfDepartment: "Maria Garcia",
    status: "Active" 
  },
  { 
    id: 3, 
    departmentCode: "TREAS", 
    departmentName: "Treasury Department", 
    description: "Manages LGU funds and collections", 
    headOfDepartment: "Robert Reyes",
    status: "Active" 
  },
  { 
    id: 4, 
    departmentCode: "IT", 
    departmentName: "Information Technology Department", 
    description: "Manages technology infrastructure and systems", 
    headOfDepartment: "James Rodriguez",
    status: "Active" 
  },
];

const initialState = {
  departments: initialDepartments,
  department: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialDepartments);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addDepartment = createAsyncThunk(
  'departments/addDepartment',
  async (department, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newDepartment = {
            ...department,
            id: Date.now(), // Generate a temporary ID
            status: department.status || 'Active',
          };
          resolve(newDepartment);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async (department, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(department);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
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

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
    resetDepartmentState: (state) => {
      state.department = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch departments
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = action.payload;
        state.error = null;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add department
      .addCase(addDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments.push(action.payload);
        state.error = null;
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update department
      .addCase(updateDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.departments.findIndex(
          (department) => department.id === action.payload.id
        );
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete department
      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.departments = state.departments.filter(
          (department) => department.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setDepartment, resetDepartmentState } = departmentSlice.actions;

export default departmentSlice.reducer;