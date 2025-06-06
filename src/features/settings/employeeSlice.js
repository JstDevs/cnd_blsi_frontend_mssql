import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialEmployees = [
  {
    id: 1,
    employeeCode: 'E001',
    firstName: 'John',
    lastName: 'Smith',
    middleName: 'David',
    birthDate: '1990-01-01',
    gender: 'Male',
    civilStatus: 'Married',
    address: '123 Employee St., City',
    contactNumber: '09123456789',
    email: 'john.smith@lgu.gov.ph',
    departmentId: 1,
    departmentName: 'Information Technology Department',
    position: 'Administrative Officer III',
    employmentStatus: 'Regular',
    dateHired: '2020-01-01',
    tin: '123-456-789-000',
    sssNumber: '12-3456789-0',
    philHealthNumber: '12-345678901-2',
    pagIbigNumber: '1234-5678-9012',
    status: 'Active',
  },
  // Add more mock employees as needed
];

const initialState = {
  employees: initialEmployees,
  employee: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialEmployees);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employee, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newEmployee = {
            ...employee,
            id: Date.now(),
            employeeCode: `E${String(Math.floor(Math.random() * 900) + 100)}`,
          };
          resolve(newEmployee);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async (employee, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(employee);
        }, 500);
      });
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
      });
  },
});

export const { setEmployee, resetEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;