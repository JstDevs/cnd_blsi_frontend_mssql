import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock initial data
const initialEmployees = []
// const initialEmployees = [
//   {
//     id: 1,
//     employeeCode: 'E001',
//     firstName: 'John',
//     lastName: 'Smith',
//     middleName: 'David',
//     birthDate: '1990-01-01',
//     gender: 'Male',
//     civilStatus: 'Married',
//     address: '123 Employee St., City',
//     contactNumber: '09123456789',
//     email: 'john.smith@lgu.gov.ph',
//     departmentId: 1,
//     departmentName: 'Information Technology Department',
//     position: 'Administrative Officer III',
//     employmentStatus: 'Regular',
//     dateHired: '2020-01-01',
//     tin: '123-456-789-000',
//     sssNumber: '12-3456789-0',
//     philHealthNumber: '12-345678901-2',
//     pagIbigNumber: '1234-5678-9012',
//     status: 'Active',
//   },
//   // Add more mock employees as needed
// ];

const initialState = {
  employees: initialEmployees,
  employee: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
// export const fetchEmployees = createAsyncThunk(
//   'employees/fetchEmployees',
//   async (_, thunkAPI) => {
//     try {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(initialEmployees);
//         }, 500);
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/employee`, {
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


export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employee, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(employee),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add employee');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (employee, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/employee/${employee.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(employee),
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


export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/employee/${ID}`, {
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

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployee: (state, action) => {
      state.employee = action.payload;
    },
    resetEmployeeState: (state) => {
      state.employee = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add employee
      .addCase(addEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees.push(action.payload);
        state.error = null;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.employees.findIndex(
          (employee) => employee.id === action.payload.id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employees = state.employees.filter(
          (employee) => employee.ID !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setEmployee, resetEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;