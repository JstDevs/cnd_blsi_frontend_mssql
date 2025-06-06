import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialUsers = [
  {
    id: 1,
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@lgu.gov.ph',
    departmentId: 4,
    departmentName: 'Information Technology Department',
    position: 'System Administrator',
    role: 'Administrator',
    status: 'Active',
    lastLoginDate: '2024-01-15T08:30:00'
  },
  {
    id: 2,
    username: 'jsmith',
    firstName: 'John',
    lastName: 'Smith',
    email: 'jsmith@lgu.gov.ph',
    departmentId: 2,
    departmentName: 'Accounting Department',
    position: 'Accountant III',
    role: 'Department Head',
    status: 'Active',
    lastLoginDate: '2024-01-15T09:15:00'
  },
  {
    id: 3,
    username: 'mgarcia',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'mgarcia@lgu.gov.ph',
    departmentId: 1,
    departmentName: 'Office of the Mayor',
    position: 'Executive Assistant',
    role: 'Staff',
    status: 'Active',
    lastLoginDate: '2024-01-15T08:45:00'
  }
];

const initialState = {
  users: initialUsers,
  user: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialUsers);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (user, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            ...user,
            id: Date.now(),
            status: user.status || 'Active',
            lastLoginDate: null
          };
          resolve(newUser);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(user);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
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

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUserState: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add user
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, resetUserState } = userSlice.actions;

export default userSlice.reducer;