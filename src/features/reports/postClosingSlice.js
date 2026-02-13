import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    postClosingData: [],
    isLoading: false,
    error: null,
};

export const fetchPostClosingData = createAsyncThunk(
    'postClosing/fetchPostClosingData',
    async (filters, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${API_URL}/postClosingReport/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filters),
            });

            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.error || res.message || 'Failed to fetch');
            }
            return res;
        } catch (error) {
            console.error('Error fetching post-closing data:', error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const postClosingSlice = createSlice({
    name: 'postClosing',
    initialState,
    reducers: {
        resetPostClosingState: (state) => {
            state.postClosingData = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostClosingData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPostClosingData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.postClosingData = action.payload;
            })
            .addCase(fetchPostClosingData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetPostClosingState } = postClosingSlice.actions;
export default postClosingSlice.reducer;
