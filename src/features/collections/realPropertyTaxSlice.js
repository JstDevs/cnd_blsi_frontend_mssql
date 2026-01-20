import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axiosInstance';

// Fetch list
export const fetchRealPropertyTaxes = createAsyncThunk(
  'realPropertyTax/fetchRealPropertyTaxes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/real-property-tax/list');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Save (create or update depending on IsNew flag)
export const saveRealPropertyTax = createAsyncThunk(
  'realPropertyTax/saveRealPropertyTax',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post('/real-property-tax/save', payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get TD Number
export const getTdNumber = createAsyncThunk(
  'realPropertyTax/getTdNumber',
  async ({ ownerId, generalRevision }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/real-property-tax/getTdNumber?ownerId=${ownerId}&generalRevision=${generalRevision}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add Button
export const addButtonTDNumber = createAsyncThunk(
  'realPropertyTax/addButtonTDNumber',
  async ({ tdNumber, selectedYear }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/real-property-tax/addButton?tdNumber=${tdNumber}&generalRevisionYear=${selectedYear}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const voidRealPropertyTax = createAsyncThunk(
  'realPropertyTax/voidRealPropertyTax',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post('/real-property-tax/void', payload);
      return { id: payload.id, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  realPropertyTaxes: [],
  isLoading: false,
  error: null,
  tdNumber: null,
  addButtonResult: null,
};

const realPropertyTaxSlice = createSlice({
  name: 'realPropertyTax',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch list
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
        state.error = action.payload;
      })
      // Save (create/update)
      .addCase(saveRealPropertyTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(voidRealPropertyTax.fulfilled, (state, action) => {
        const index = state.realPropertyTaxes.findIndex(
          (item) => item.ID === action.payload.id
        );
        if (index !== -1) {
          state.realPropertyTaxes[index].Status = 'Void';
        }
      })
      .addCase(saveRealPropertyTax.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedItem = action.payload;
        const index = state.realPropertyTaxes.findIndex(
          (item) => item.id === updatedItem.id
        );
        if (index !== -1) {
          state.realPropertyTaxes[index] = updatedItem; // update
        } else {
          state.realPropertyTaxes.push(updatedItem); // create
        }
      })
      .addCase(saveRealPropertyTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get TD Number
      .addCase(getTdNumber.fulfilled, (state, action) => {
        state.tdNumber = action.payload;
      })
      // Add Button
      .addCase(addButtonTDNumber.fulfilled, (state, action) => {
        state.addButtonResult = action.payload;
      });
  },
});

export default realPropertyTaxSlice.reducer;
