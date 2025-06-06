import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialVendors = [
  {
    id: 1,
    vendorCode: 'V001',
    vendorName: 'ABC Office Supplies',
    address: '123 Main St., City',
    contactPerson: 'John Smith',
    contactNumber: '09123456789',
    email: 'abc@example.com',
    tin: '123-456-789-000',
    category: 'Office Supplies',
    accreditationDate: '2024-01-01',
    accreditationExpiry: '2025-01-01',
    bankAccount: '1234-5678-9012',
    bankName: 'Sample Bank',
    status: 'Active',
  },
  // Add more mock vendors as needed
];

const initialState = {
  vendors: initialVendors,
  vendor: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls
export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (_, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialVendors);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addVendor = createAsyncThunk(
  'vendors/addVendor',
  async (vendor, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const newVendor = {
            ...vendor,
            id: Date.now(),
            vendorCode: `V${String(Math.floor(Math.random() * 900) + 100)}`,
          };
          resolve(newVendor);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateVendor = createAsyncThunk(
  'vendors/updateVendor',
  async (vendor, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(vendor);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setVendor: (state, action) => {
      state.vendor = action.payload;
    },
    resetVendorState: (state) => {
      state.vendor = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vendors
      .addCase(fetchVendors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action.payload;
        state.error = null;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add vendor
      .addCase(addVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors.push(action.payload);
        state.error = null;
      })
      .addCase(addVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update vendor
      .addCase(updateVendor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.vendors.findIndex(
          (vendor) => vendor.id === action.payload.id
        );
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setVendor, resetVendorState } = vendorSlice.actions;
export default vendorSlice.reducer;