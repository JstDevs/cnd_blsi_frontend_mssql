import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockDocumentDetails = [];
export const fetchDocumentDetails = createAsyncThunk(
  'documentDetails/fetchDocumentDetails',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/documentType`, {
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


export const addDocumentDetail = createAsyncThunk(
  'documentDetails/addDocumentDetail',
  async (documentDetail, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/documentType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(documentDetail),
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

export const updateDocumentDetail = createAsyncThunk(
  'documentDetails/updateDocumentDetail',
  async (documentDetail, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/documentType/${documentDetail.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(documentDetail),
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

export const deleteDocumentDetail = createAsyncThunk(
  'documentDetails/deleteDocumentDetail',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/documentType/${ID}`, {
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

const documentDetailsSlice = createSlice({
  name: 'documentDetails',
  initialState: {
    documentDetails: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocumentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documentDetails = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchDocumentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch document details';
        console.warn('Failed to fetch document details, using mock data.', state.error);
        state.documentDetails = mockDocumentDetails;
      })
      .addCase(addDocumentDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDocumentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.documentDetails)) {
          state.documentDetails = [];
        }
        state.documentDetails.push(action.payload);
      })
      .addCase(addDocumentDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add document detail';
        console.error('Failed to add document detail:', state.error);
      })
      .addCase(updateDocumentDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDocumentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.documentDetails.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.documentDetails)) {
            state.documentDetails = [];
          }
          state.documentDetails[index] = action.payload;
        }
      })
      .addCase(deleteDocumentDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDocumentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.documentDetails)) {
          state.documentDetails = [];
        }
        state.documentDetails = state.documentDetails.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteDocumentDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete document detail';
        console.error('Failed to delete document detail:', state.error);
      });
  },
});

export const documentDetailsReducer = documentDetailsSlice.reducer;