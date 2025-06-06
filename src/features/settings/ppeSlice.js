import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial data
const initialPPEs = [
  {
    id: 1,
    category: 'Building',
    description: 'Municipal Hall',
    depreciationRate: 5,
    depreciationValue: 10000,
    netBookValue: 90000,
    supplier: 'Supplier1',
    ppeNumber: 1001,
    unit: 'pcs',
    barcode: 1234567890,
    quantity: 1,
    cost: 100000,
    dateAcquired: '2022-01-01',
    usefulLife: 10,
    poNumber: 1234,
    prNumber: 5678,
    invoiceNumber: 91011,
    airNumber: 1213,
    risNumber: 1415,
    remarks: 'Main government building',
  },
  {
    id: 2,
    category: 'Equipment',
    description: 'Desktop Computer',
    depreciationRate: 20,
    depreciationValue: 8000,
    netBookValue: 12000,
    supplier: 'Supplier2',
    ppeNumber: 2002,
    unit: 'set',
    barcode: 2233445566,
    quantity: 10,
    cost: 20000,
    dateAcquired: '2023-03-15',
    usefulLife: 5,
    poNumber: 2345,
    prNumber: 6789,
    invoiceNumber: 11213,
    airNumber: 1415,
    risNumber: 1617,
    remarks: 'IT Department computers',
  },
  {
    id: 3,
    category: 'Vehicle',
    description: 'Service Van',
    depreciationRate: 10,
    depreciationValue: 50000,
    netBookValue: 450000,
    supplier: 'Supplier1',
    ppeNumber: 3003,
    unit: 'unit',
    barcode: 3344556677,
    quantity: 2,
    cost: 500000,
    dateAcquired: '2021-07-10',
    usefulLife: 8,
    poNumber: 3456,
    prNumber: 7890,
    invoiceNumber: 13141,
    airNumber: 1516,
    risNumber: 1718,
    remarks: 'Transport for field work',
  },
];

const initialCategories = [
  { value: 'Building', label: 'Building' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Vehicle', label: 'Vehicle' },
];

const initialSuppliers = [
  { value: 'Supplier1', label: 'Supplier 1' },
  { value: 'Supplier2', label: 'Supplier 2' },
];

const initialState = {
  ppes: initialPPEs,
  ppe: null,
  isLoading: false,
  error: null,
  categories: initialCategories,
  suppliers: initialSuppliers,
};

export const fetchPPEs = createAsyncThunk(
  'ppes/fetchPPEs',
  async (_, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(initialPPEs);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addPPE = createAsyncThunk(
  'ppes/addPPE',
  async (ppe, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPPE = {
            ...ppe,
            id: Date.now(),
          };
          resolve(newPPE);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePPE = createAsyncThunk(
  'ppes/updatePPE',
  async (ppe, thunkAPI) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(ppe);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deletePPE = createAsyncThunk(
  'ppes/deletePPE',
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

const ppeSlice = createSlice({
  name: 'ppes',
  initialState,
  reducers: {
    setPPE: (state, action) => {
      state.ppe = action.payload;
    },
    resetPPEResource: (state) => {
      state.ppe = null;
      state.error = null;
    },
    addCategory: (state, action) => {
      // Only add if not already present
      if (!state.categories.some(cat => cat.value.toLowerCase() === action.payload.toLowerCase())) {
        state.categories.push({ value: action.payload, label: action.payload });
      }
    },
    addSupplier: (state, action) => {
      if (!state.suppliers.some(sup => sup.value.toLowerCase() === action.payload.toLowerCase())) {
        state.suppliers.push({ value: action.payload, label: action.payload });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPPEs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPPEs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ppes = action.payload;
        state.error = null;
      })
      .addCase(fetchPPEs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addPPE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPPE.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ppes.push(action.payload);
        state.error = null;
      })
      .addCase(addPPE.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePPE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePPE.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.ppes.findIndex((ppe) => ppe.id === action.payload.id);
        if (index !== -1) {
          state.ppes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePPE.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deletePPE.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePPE.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ppes = state.ppes.filter((ppe) => ppe.id !== action.payload);
        state.error = null;
      })
      .addCase(deletePPE.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setPPE, resetPPEResource, addCategory, addSupplier } = ppeSlice.actions;
export default ppeSlice.reducer; 