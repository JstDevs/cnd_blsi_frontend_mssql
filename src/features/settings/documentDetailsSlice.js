import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/document-details';

// Mock data for initial state
const mockDocumentDetails = [
  {
    id: 1,
    name: 'Purchase Request',
    code: 'PR',
    prefix: 'PR-',
    suffix: '-2024',
    startNumber: 1,
    currentNumber: 100,
    documentTypeCategory: 'Financial',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Disbursement Voucher',
    code: 'DV',
    prefix: 'DV-',
    suffix: '-2024',
    startNumber: 1,
    currentNumber: 50,
    documentTypeCategory: 'Financial',
    status: 'Active',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Travel Order',
    code: 'TO',
    prefix: 'TO-',
    suffix: '-2024',
    startNumber: 1,
    currentNumber: 25,
    documentTypeCategory: 'Administrative',
    status: 'Active',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  }
];

// Mock document type categories
const mockCategories = [
  { value: 'Financial', label: 'Financial' },
  { value: 'Administrative', label: 'Administrative' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Personnel', label: 'Personnel' }
];

export const fetchDocumentDetails = createAsyncThunk('documentDetails/fetchDocumentDetails', async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('API fetchDocumentDetails successful:', response.data);
    return response.data;
  } catch (error) {
    console.warn('API not available for fetchDocumentDetails, using mock data:', error.message);
    // Ensure we return the mock data explicitly on API error
    return mockDocumentDetails;
  }
});

export const addDocumentDetail = createAsyncThunk('documentDetails/addDocumentDetail', async (documentDetail) => {
  try {
    const response = await axios.post(API_URL, documentDetail);
    console.log('API addDocumentDetail successful:', response.data);
    return response.data;
  } catch (error) {
    console.warn('API not available for addDocumentDetail, using mock data:', error.message);
    const newId = Math.max(...mockDocumentDetails.map(d => d.id)) + 1;
    const newMockDocument = {
      ...documentDetail,
      id: newId,
      status: documentDetail.status || 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    console.log('Using mock data for addDocumentDetail:', newMockDocument);
    return newMockDocument;
  }
});

export const updateDocumentDetail = createAsyncThunk('documentDetails/updateDocumentDetail', async (documentDetail) => {
  try {
    const response = await axios.put(`${API_URL}/${documentDetail.id}`, documentDetail);
    console.log('API updateDocumentDetail successful:', response.data);
    return response.data;
  } catch (error) {
    console.warn('API not available for updateDocumentDetail, returning original data with updated timestamp:', error.message);
    return {
      ...documentDetail,
      updatedAt: new Date().toISOString()
    };
  }
});

export const deleteDocumentDetail = createAsyncThunk('documentDetails/deleteDocumentDetail', async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    console.log('API deleteDocumentDetail successful, id:', id);
    return id;
  } catch (error) {
    console.warn('API not available for deleteDocumentDetail, returning id:', error.message);
    return id;
  }
});

export const addDocumentCategory = createAsyncThunk('documentDetails/addDocumentCategory', async (category) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, { name: category }); // Assuming category name is sent in the body
    console.log('API addDocumentCategory successful:', response.data);
    return response.data;
  } catch (error) {
    console.warn('API not available for addDocumentCategory, using mock data:', error.message);
    // Check if category already exists in mock data
    const existingCategory = mockCategories.find(c => c.value.toLowerCase() === category.toLowerCase());
    if (existingCategory) {
      console.warn('Category already exists in mock data:', existingCategory);
      return existingCategory;
    }
    const newMockCategory = { value: category, label: category };
    console.log('Using mock data for addDocumentCategory:', newMockCategory);
    return newMockCategory;
  }
});

const documentDetailsSlice = createSlice({
  name: 'documentDetails',
  initialState: {
    documentDetails: mockDocumentDetails,
    categories: mockCategories,
    isLoading: false,
    error: null,
    selectedDocument: null,
    filters: {
      status: 'all',
      search: '',
      category: 'all'
    },
    sort: {
      field: 'name',
      direction: 'asc'
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: mockDocumentDetails.length,
      itemsPerPage: 10
    }
  },
  reducers: {
    setSelectedDocument: (state, action) => {
      state.selectedDocument = action.payload;
    },
    clearSelectedDocument: (state) => {
      state.selectedDocument = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure payload is an array before updating state
        if (Array.isArray(action.payload)) {
            console.log('fetchDocumentDetails fulfilled, payload:', action.payload);
            state.documentDetails = action.payload;
            state.pagination.totalItems = action.payload.length;
        } else {
            console.error('fetchDocumentDetails fulfilled with non-array payload:', action.payload);
            state.documentDetails = []; // Reset to empty array if payload is not an array
            state.pagination.totalItems = 0;
        }
      })
      .addCase(fetchDocumentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.error('fetchDocumentDetails rejected:', action.error.message);
      })
      .addCase(addDocumentDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDocumentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the new document detail and update totalItems
        console.log('addDocumentDetail fulfilled, payload:', action.payload);
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
            state.documentDetails = [...state.documentDetails, action.payload];
            state.pagination.totalItems = state.documentDetails.length;
        } else {
            console.error('addDocumentDetail fulfilled with invalid payload:', action.payload);
        }
      })
      .addCase(addDocumentDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.error('addDocumentDetail rejected:', action.error.message);
      })
      .addCase(updateDocumentDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDocumentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('updateDocumentDetail fulfilled, payload:', action.payload);
        const index = state.documentDetails.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.documentDetails[index] = action.payload;
        }
      })
      .addCase(updateDocumentDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.error('updateDocumentDetail rejected:', action.error.message);
      })
      .addCase(deleteDocumentDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDocumentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('deleteDocumentDetail fulfilled, payload (deleted id):', action.payload);
        // Filter out the deleted item and update totalItems
        state.documentDetails = state.documentDetails.filter(d => d.id !== action.payload);
        state.pagination.totalItems = state.documentDetails.length;
      })
      .addCase(deleteDocumentDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.error('deleteDocumentDetail rejected:', action.error.message);
      })
      .addCase(addDocumentCategory.fulfilled, (state, action) => {
        console.log('addDocumentCategory fulfilled, payload:', action.payload);
        // Check if category already exists
        const exists = state.categories.some(c => c.value === action.payload.value);
        if (!exists) {
          state.categories = [...state.categories, action.payload];
        } else {
            console.warn('addDocumentCategory fulfilled, category already exists:', action.payload);
        }
      });
  }
});

export const { setSelectedDocument, clearSelectedDocument } = documentDetailsSlice.actions;
export default documentDetailsSlice.reducer; 