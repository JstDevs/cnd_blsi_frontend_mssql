import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/items';

// Mock data for initial state
const mockItems = [
  {
    id: 1,
    code: 'ITEM001',
    name: 'Laptop',
    chargeAccount: '1010 - Cash on Hand',
    type: 'Inventory',
    taxCode: 'VAT',
    taxRate: 12,
    ewt: 0,
    vatable: true,
    status: 'Active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    code: 'ITEM002',
    name: 'Printer',
    chargeAccount: '1020 - Cash in Bank',
    type: 'Asset',
    taxCode: 'Exempt',
    taxRate: 0,
    ewt: 0,
    vatable: false,
    status: 'Active',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    code: 'ITEM003',
    name: 'Consulting Service',
    chargeAccount: '4010 - Service Revenue',
    type: 'Service',
    taxCode: 'VAT',
    taxRate: 12,
    ewt: 2,
    vatable: true,
    status: 'Active',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
];

// Mock options for select fields
const mockChargeAccounts = [
  { value: '1010 - Cash on Hand', label: '1010 - Cash on Hand' },
  { value: '1020 - Cash in Bank', label: '1020 - Cash in Bank' },
  { value: '4010 - Service Revenue', label: '4010 - Service Revenue' },
];

const mockTypes = [
  { value: 'Inventory', label: 'Inventory' },
  { value: 'Asset', label: 'Asset' },
  { value: 'Service', label: 'Service' },
];

const mockTaxCodes = [
  { value: 'VAT', label: 'VAT' },
  { value: 'Exempt', label: 'Exempt' },
  { value: 'Zero Rated', label: 'Zero Rated' },
];

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.warn('API not available for fetchItems, using mock data:', error.message);
    return mockItems;
  }
});

export const addItem = createAsyncThunk('items/addItem', async (item) => {
  try {
    const response = await axios.post(API_URL, item);
    return response.data;
  } catch (error) {
    console.warn('API not available for addItem, using mock data:', error.message);
    const newId = Math.max(...mockItems.map(i => i.id)) + 1;
    return {
      ...item,
      id: newId,
      status: item.status || 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
});

export const updateItem = createAsyncThunk('items/updateItem', async (item) => {
  try {
    const response = await axios.put(`${API_URL}/${item.id}`, item);
    return response.data;
  } catch (error) {
    console.warn('API not available for updateItem, returning original data with updated timestamp:', error.message);
    return {
      ...item,
      updatedAt: new Date().toISOString()
    };
  }
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    console.warn('API not available for deleteItem, returning id:', error.message);
    return id;
  }
});

const itemSlice = createSlice({
  name: 'items',
  initialState: {
    items: mockItems,
    chargeAccounts: mockChargeAccounts,
    types: mockTypes,
    taxCodes: mockTaxCodes,
    isLoading: false,
    error: null,
    selectedItem: null,
    filters: {
      status: 'all',
      search: '',
      chargeAccount: 'all',
      type: 'all',
      taxCode: 'all',
    },
    sort: {
      field: 'name',
      direction: 'asc'
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: mockItems.length,
      itemsPerPage: 10
    }
  },
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearSelectedItem: (state) => {
      state.selectedItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
         if (Array.isArray(action.payload)) {
            console.log('fetchItems fulfilled, payload:', action.payload);
            state.items = action.payload;
            state.pagination.totalItems = action.payload.length;
        } else {
            console.error('fetchItems fulfilled with non-array payload:', action.payload);
            state.items = [];
            state.pagination.totalItems = 0;
        }
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
         console.error('fetchItems rejected:', action.error.message);
      })
      .addCase(addItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.isLoading = false;
         if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
            state.items = [...state.items, action.payload];
            state.pagination.totalItems = state.items.length;
        } else {
            console.error('addItem fulfilled with invalid payload:', action.payload);
        }
      })
      .addCase(addItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
         console.error('addItem rejected:', action.error.message);
      })
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.pagination.totalItems = state.items.length;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSelectedItem, clearSelectedItem } = itemSlice.actions;
export default itemSlice.reducer; 