import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockDocumentTypeCategories = [];
export const fetchDocumentTypeCategories = createAsyncThunk(
  'documentTypeCategories/fetchDocumentTypeCategories',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/documentTypeCategory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const addDocumentTypeCategory = createAsyncThunk(
  'documentTypeCategories/addDocumentTypeCategory',
  async (documentTypeCategory, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/documentTypeCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(documentTypeCategory),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateDocumentTypeCategory = createAsyncThunk(
  'documentTypeCategories/updateDocumentTypeCategory',
  async (documentTypeCategory, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/documentTypeCategory/${documentTypeCategory.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(documentTypeCategory),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteDocumentTypeCategory = createAsyncThunk(
  'documentTypeCategories/deleteDocumentTypeCategory',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/documentTypeCategory/${ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete');
      }

      return ID; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const documentTypeCategoriesSlice = createSlice({
  name: 'documentTypeCategories',
  initialState: {
    documentTypeCategories: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentTypeCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentTypeCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documentTypeCategories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDocumentTypeCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch document type categories';
        console.warn('Failed to fetch document type categories, using mock data.', state.error);
        state.documentTypeCategories = mockDocumentTypeCategories;
      })
      .addCase(addDocumentTypeCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDocumentTypeCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.documentTypeCategories)) {
          state.documentTypeCategories = [];
        }
        state.documentTypeCategories.push(action.payload);
      })
      .addCase(addDocumentTypeCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add document type category';
        console.error('Failed to add document type category:', state.error);
      })
      .addCase(updateDocumentTypeCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDocumentTypeCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.documentTypeCategories.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.documentTypeCategories)) {
            state.documentTypeCategories = [];
          }
          state.documentTypeCategories[index] = action.payload;
        }
      })
      .addCase(deleteDocumentTypeCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDocumentTypeCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.documentTypeCategories)) {
          state.documentTypeCategories = [];
        }
        state.documentTypeCategories = state.documentTypeCategories.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteDocumentTypeCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete document type category';
        console.error('Failed to delete document type category:', state.error);
      });
  },
});

export const documentTypeCategoriesReducer = documentTypeCategoriesSlice.reducer;