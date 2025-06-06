import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchRealPropertyTaxes = createAsyncThunk(
  'realPropertyTax/fetchRealPropertyTaxes',
  async () => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            tdNo: 'TD-001',
            owner: 'John Doe',
            address: '123 Main St',
            beneficialUser: 'Jane Doe',
            beneficialAddress: '456 Oak St',
            octTctCloaNo: 'OCT-123',
            cct: 'CCT-456',
            dated: '2024-03-20',
            propertyIdentificationNo: '12345',
            tin: '123-456-789',
            ownerTelephoneNo: '1234567890',
            beneficialTin: '987-654-321',
            beneficialTelephoneNo: '0987654321',
            surveyNo: 'S-001',
            lotNo: 'L-001',
            blockNo: 'B-001',
            boundaries: {
              taxable: true,
              north: 'Street A',
              south: 'Street B',
              east: 'Street C',
              west: 'Street D',
            },
            cancelledTdNo: 'TD-000',
            cancelledOwner: 'Previous Owner',
            effectivityOfAssessment: '2024-01-01',
            previousOwner: 'Previous Owner',
            previousAssessedValue: '1000000',
            propertyDetails: {
              kind: 'Land',
              numberOf: '1',
              description: 'Residential lot',
            },
            assessmentDetails: {
              kind: 'Land',
              actualUse: 'Residential',
              classification: 'Class 1',
              areaSize: 'Medium',
              assessmentLevel: '20%',
              marketValue: '1500000',
            },
            status: 'active',
          },
        ]);
      }, 1000);
    });
  }
);

export const createRealPropertyTax = createAsyncThunk(
  'realPropertyTax/createRealPropertyTax',
  async (data) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: Date.now(), ...data });
      }, 1000);
    });
  }
);

export const updateRealPropertyTax = createAsyncThunk(
  'realPropertyTax/updateRealPropertyTax',
  async ({ id, data }) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, ...data });
      }, 1000);
    });
  }
);

export const deleteRealPropertyTax = createAsyncThunk(
  'realPropertyTax/deleteRealPropertyTax',
  async (id) => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(id);
      }, 1000);
    });
  }
);

const initialState = {
  realPropertyTaxes: [],
  isLoading: false,
  error: null,
};

const realPropertyTaxSlice = createSlice({
  name: 'realPropertyTax',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch real property taxes
      .addCase(fetchRealPropertyTaxes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRealPropertyTaxes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.realPropertyTaxes = action.payload;
      })
      .addCase(fetchRealPropertyTaxes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Create real property tax
      .addCase(createRealPropertyTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRealPropertyTax.fulfilled, (state, action) => {
        state.isLoading = false;
        state.realPropertyTaxes.push(action.payload);
      })
      .addCase(createRealPropertyTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Update real property tax
      .addCase(updateRealPropertyTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRealPropertyTax.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.realPropertyTaxes.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.realPropertyTaxes[index] = action.payload;
        }
      })
      .addCase(updateRealPropertyTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Delete real property tax
      .addCase(deleteRealPropertyTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRealPropertyTax.fulfilled, (state, action) => {
        state.isLoading = false;
        state.realPropertyTaxes = state.realPropertyTaxes.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteRealPropertyTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default realPropertyTaxSlice.reducer; 