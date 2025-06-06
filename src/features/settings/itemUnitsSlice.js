import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const mockItemUnits = [
  { id: '1', code: 'PC', name: 'Piece' },
  { id: '2', code: 'BOX', name: 'Box' },
  { id: '3', code: 'KG', name: 'Kilogram' },
];

// Async Thunks (Mock API calls)
export const fetchItemUnits = createAsyncThunk('itemUnits/fetchItemUnits', async () => {
  console.log('Mock API call: Fetching item units');
  return new Promise(resolve => setTimeout(() => resolve(mockItemUnits), 500));
});

export const addItemUnit = createAsyncThunk('itemUnits/addItemUnit', async (itemUnit) => {
  console.log('Mock API call: Adding item unit', itemUnit);
  const newItemUnit = { ...itemUnit, id: Date.now().toString() }; // Assign a mock ID
  return new Promise(resolve => setTimeout(() => resolve(newItemUnit), 500));
});

export const updateItemUnit = createAsyncThunk('itemUnits/updateItemUnit', async (itemUnit) => {
  console.log('Mock API call: Updating item unit', itemUnit);
  return new Promise(resolve => setTimeout(() => resolve(itemUnit), 500));
});

export const deleteItemUnit = createAsyncThunk('itemUnits/deleteItemUnit', async (id) => {
  console.log('Mock API call: Deleting item unit with ID', id);
  return new Promise(resolve => setTimeout(() => resolve(id), 500));
});

const itemUnitsSlice = createSlice({
  name: 'itemUnits',
  initialState: {
    itemUnits: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemUnits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItemUnits.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure state.itemUnits is treated as an array
        state.itemUnits = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchItemUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch item units';
        // Fallback to mock data on error for development
        console.warn('Failed to fetch item units, using mock data.', state.error);
        state.itemUnits = mockItemUnits;
      })
      .addCase(addItemUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure state.itemUnits is treated as an array before pushing
        if (!Array.isArray(state.itemUnits)) {
          state.itemUnits = [];
        }
        state.itemUnits.push(action.payload);
      })
      .addCase(addItemUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add item unit';
        console.error('Failed to add item unit:', state.error);
      })
      .addCase(updateItemUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItemUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.itemUnits.findIndex(unit => unit.id === action.payload.id);
        if (index !== -1) {
          // Ensure state.itemUnits is treated as an array before splicing
          if (!Array.isArray(state.itemUnits)) {
             state.itemUnits = [];
          }
          state.itemUnits[index] = action.payload;
        }
      })
      .addCase(updateItemUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update item unit';
        console.error('Failed to update item unit:', state.error);
      })
      .addCase(deleteItemUnit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItemUnit.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure state.itemUnits is treated as an array before filtering
        if (!Array.isArray(state.itemUnits)) {
          state.itemUnits = [];
        }
        state.itemUnits = state.itemUnits.filter(unit => unit.id !== action.payload);
      })
      .addCase(deleteItemUnit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete item unit';
        console.error('Failed to delete item unit:', state.error);
      });
  },
});

export const itemUnitsReducer = itemUnitsSlice.reducer; 