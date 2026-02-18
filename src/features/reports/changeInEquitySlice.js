import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    equityData: [],
    isLoading: false,
    error: null,
};

export const fetchChangeInEquity = createAsyncThunk(
    'changeInEquity/fetchChangeInEquity',
    async (filters, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${API_URL}/changeInEquityReport/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(filters),
            });
            const res = await response.json();
            if (!response.ok) throw new Error(res.error || 'Failed to fetch change in equity data');
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const changeInEquitySlice = createSlice({
    name: 'changeInEquity',
    initialState,
    reducers: {
        resetEquityState: (state) => { state.equityData = []; state.error = null; },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchChangeInEquity.pending, (state) => { state.isLoading = true; state.error = null; });
        builder.addCase(fetchChangeInEquity.fulfilled, (state, action) => { state.isLoading = false; state.equityData = action.payload; });
        builder.addCase(fetchChangeInEquity.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
    },
});

export const { resetEquityState } = changeInEquitySlice.actions;
export default changeInEquitySlice.reducer;