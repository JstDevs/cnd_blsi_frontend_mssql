import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    alphalistData: [],
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchAlphalist = createAsyncThunk(
    'alphalist/fetchAlphalist',
    async (filters, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');

            const response = await fetch(`${API_URL}/alphalist/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filters),
            });

            const res = await response.json();

            if (!response.ok) {
                throw new Error(res.error || res.message || 'Failed to fetch Alphalist data');
            }

            return res;
        } catch (error) {
            console.error('Error fetching alphalist:', error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const alphalistSlice = createSlice({
    name: 'alphalist',
    initialState,
    reducers: {
        resetAlphalistState: (state) => {
            state.alphalistData = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAlphalist.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAlphalist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.alphalistData = action.payload;
            })
            .addCase(fetchAlphalist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetAlphalistState } = alphalistSlice.actions;

export default alphalistSlice.reducer;
