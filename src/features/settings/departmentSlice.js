import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialDepartments = [];
// const initialDepartments = [
//   { 
//     ID: 1, 
//     Code: "MAYOR", 
//     Name: "Office of the Mayor", 
//     description: "The executive office of the LGU", 
//     headOfDepartment: "Mayor John Santos",
//     status: "Active" 
//   },
//   { 
//     ID: 2, 
//     Code: "ACCTG", 
//     Name: "Accounting Department", 
//     description: "Handles financial records and reporting", 
//     headOfDepartment: "Maria Garcia",
//     status: "Active" 
//   },
//   { 
//     ID: 3, 
//     Code: "TREAS", 
//     Name: "Treasury Department", 
//     description: "Manages LGU funds and collections", 
//     headOfDepartment: "Robert Reyes",
//     status: "Active" 
//   },
//   { 
//     ID: 4, 
//     Code: "IT", 
//     Name: "Information Technology Department", 
//     description: "Manages technology infrastructure and systems", 
//     headOfDepartment: "James Rodriguez",
//     status: "Active" 
//   },
// ];

const initialState = {
  departments: initialDepartments,
  department: null,
  isLoading: false,
  error: null,
};

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/department`, {
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
// export const fetchDepartments = createAsyncThunk(
//   'departments/fetchDepartments',
//   async (_, thunkAPI) => {
//     try {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(initialDepartments);
//         }, 500);
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );


export const addDepartment = createAsyncThunk(
  'departments/addDepartment',
  async (department, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/department`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(department),
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
// export const addDepartment = createAsyncThunk(
//   'departments/addDepartment',
//   async (department, thunkAPI) => {
//     try {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           const newDepartment = {
//             ...department,
//             id: Date.now(), // Generate a temporary ID
//             status: department.status || 'Active',
//           };
//           resolve(newDepartment);
//         }, 500);
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );


export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async (department, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/department/${department.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(department),
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

// export const updateDepartment = createAsyncThunk(
//   'departments/updateDepartment',
//   async (department, thunkAPI) => {
//     try {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(department);
//         }, 500);
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const deleteDepartment = createAsyncThunk(
  'department/deleteDepartment',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/department/${ID}`, {
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
// export const deleteDepartment = createAsyncThunk(
//   'departments/deleteDepartment',
//   async (id, thunkAPI) => {
//     try {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(id);
//         }, 500);
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

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
          (department) => department.ID === action.payload.ID
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
          (department) => department.ID !== action.payload
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