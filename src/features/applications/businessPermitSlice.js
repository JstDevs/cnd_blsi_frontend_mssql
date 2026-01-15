import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data (Fallback)
const mockPermits = [];

export const fetchBusinessPermits = createAsyncThunk(
    'businessPermit/fetchBusinessPermits',
    async (_, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');

            const response = await fetch(`${API_URL}/business-permit/getall`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const res = await response.json();

            if (!response.ok) {
                throw new Error(res.message || 'Failed to fetch business permits');
            }

            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchBusinessPermitById = createAsyncThunk(
    'businessPermit/fetchBusinessPermitById',
    async (id, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');

            const response = await fetch(`${API_URL}/business-permit/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const res = await response.json();

            if (!response.ok) {
                throw new Error(res.message || 'Failed to fetch business permit record');
            }

            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addBusinessPermit = createAsyncThunk(
    'businessPermit/addBusinessPermit',
    async (businessPermit, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');
            // Use FormData if attachments are involved, otherwise JSON
            // Assuming logic in Page component handles whether to send JSON or FormData
            // But typically for files we use FormData. 
            // If the page sends FormData, we don't set Content-Type header (browser does it).

            const isFormData = businessPermit instanceof FormData;

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
            }

            const body = isFormData ? businessPermit : JSON.stringify(businessPermit);

            const response = await fetch(`${API_URL}/business-permit/save`, {
                method: 'POST',
                headers: headers,
                body: body,
            });

            const res = await response.json();

            if (!response.ok) {
                throw new Error(res.message || 'Failed to add business permit record');
            }

            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateBusinessPermit = createAsyncThunk(
    'businessPermit/updateBusinessPermit',
    async ({ id, data }, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');

            const isFormData = data instanceof FormData;

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            if (!isFormData) {
                headers['Content-Type'] = 'application/json';
            }

            const body = isFormData ? data : JSON.stringify(data);

            const response = await fetch(
                `${API_URL}/business-permit/${id}`,
                {
                    method: 'PUT',
                    headers: headers,
                    body: body,
                }
            );

            const res = await response.json();

            if (!response.ok) {
                throw new Error(res.message || 'Failed to update business permit record');
            }

            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteBusinessPermit = createAsyncThunk(
    'businessPermit/deleteBusinessPermit',
    async (id, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${API_URL}/business-permit/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Failed to delete business permit record'
                );
            }

            return id; // Return ID so you can remove it from Redux state
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const businessPermitSlice = createSlice({
    name: 'businessPermit',
    initialState: {
        records: [],
        currentRecord: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        clearCurrentBusinessPermit: (state) => {
            state.currentRecord = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // =======================
            // Fetch All
            // =======================
            .addCase(fetchBusinessPermits.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBusinessPermits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.records = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchBusinessPermits.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch business permits';
                // console.warn('Using mock data due to error.');
                // state.records = mockPermits;
            })
            // =======================
            // Fetch By ID
            // =======================
            .addCase(fetchBusinessPermitById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBusinessPermitById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentRecord = action.payload;
            })
            .addCase(fetchBusinessPermitById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch business permit record';
            })
            // =======================
            // Add
            // =======================
            .addCase(addBusinessPermit.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addBusinessPermit.fulfilled, (state, action) => {
                state.isLoading = false;
                if (!Array.isArray(state.records)) {
                    state.records = [];
                }
                state.records.push(action.payload);
            })
            .addCase(addBusinessPermit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to add business permit record';
            })
            // =======================
            // Update
            // =======================
            .addCase(updateBusinessPermit.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateBusinessPermit.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.records.findIndex(
                    (item) => item.id === action.payload.id
                );
                if (index !== -1) {
                    state.records[index] = action.payload;
                }
                if (state.currentRecord && state.currentRecord.id === action.payload.id) {
                    state.currentRecord = action.payload;
                }
            })
            .addCase(updateBusinessPermit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to update business permit record';
            })
            // =======================
            // Delete
            // =======================
            .addCase(deleteBusinessPermit.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteBusinessPermit.fulfilled, (state, action) => {
                state.isLoading = false;
                state.records = state.records.filter(
                    (item) => item.id !== action.payload
                );
                if (state.currentRecord && state.currentRecord.id === action.payload) {
                    state.currentRecord = null;
                }
            })
            .addCase(deleteBusinessPermit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to delete business permit record';
            });
    },
});

export const { clearCurrentBusinessPermit } = businessPermitSlice.actions;
export const businessPermitReducer = businessPermitSlice.reducer;
