import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockTaxCodes = [
  { id: '1', code: 'VAT', name: 'Value Added Tax', rate: 0.12 },
  { id: '2', code: 'EWT', name: 'Expanded Withholding Tax', rate: 0.02 },
  { id: '3', code: 'NONE', name: 'No Tax', rate: 0.00 },
];

// Async Thunks (Mock API calls)
export const fetchTaxCodes = createAsyncThunk('taxCodes/fetchTaxCodes', async () => {
  console.log('Mock API call: Fetching tax codes');
  return new Promise(resolve => setTimeout(() => resolve(mockTaxCodes), 500));
});

export const addTaxCode = createAsyncThunk('taxCodes/addTaxCode', async (taxCode) => {
  console.log('Mock API call: Adding tax code', taxCode);
  const newTaxCode = { ...taxCode, id: Date.now().toString() }; // Assign a mock ID
  return new Promise(resolve => setTimeout(() => resolve(newTaxCode), 500));
});

export const updateTaxCode = createAsyncThunk('taxCodes/updateTaxCode', async (taxCode) => {
  console.log('Mock API call: Updating tax code', taxCode);
  return new Promise(resolve => setTimeout(() => resolve(taxCode), 500));
});

export const deleteTaxCode = createAsyncThunk('taxCodes/deleteTaxCode', async (id) => {
  console.log('Mock API call: Deleting tax code with ID', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

const taxCodesSlice = createSlice({
  name: 'taxCodes',
  initialState: {
    taxCodes: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxCodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaxCodes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taxCodes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTaxCodes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tax codes';
        console.warn('Failed to fetch tax codes, using mock data.', state.error);
        state.taxCodes = mockTaxCodes;
      })
      .addCase(addTaxCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTaxCode.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.taxCodes)) {
          state.taxCodes = [];
        }
        state.taxCodes.push(action.payload);
      })
      .addCase(addTaxCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add tax code';
        console.error('Failed to add tax code:', state.error);
      })
      .addCase(updateTaxCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTaxCode.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.taxCodes.findIndex(code => code.id === action.payload.id);
        if (index !== -1) {
           if (!Array.isArray(state.taxCodes)) {
             state.taxCodes = [];
          }
          state.taxCodes[index] = action.payload;
        }
      })
      .addCase(updateTaxCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update tax code';
        console.error('Failed to update tax code:', state.error);
      })
      .addCase(deleteTaxCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTaxCode.fulfilled, (state, action) => {
        state.isLoading = false;
         if (!Array.isArray(state.taxCodes)) {
          state.taxCodes = [];
        }
        state.taxCodes = state.taxCodes.filter(code => code.id !== action.payload);
      })
      .addCase(deleteTaxCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete tax code';
        console.error('Failed to delete tax code:', state.error);
      });
  },
});

export const taxCodesReducer = taxCodesSlice.reducer; 