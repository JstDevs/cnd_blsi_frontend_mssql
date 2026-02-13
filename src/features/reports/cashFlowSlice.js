import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    cashFlowData: [],
    isLoading: false,
    error: null,
};

export const fetchCashFlowData = createAsyncThunk(
    'cashFlow/fetchCashFlowData',
    async (filters, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${API_URL}/cashFlowReport/view`, {
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
            console.error('Error fetching cash flow data:', error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const cashFlowSlice = createSlice({
    name: 'cashFlow',
    initialState,
    reducers: {
        resetCashFlowState: (state) => {
            state.cashFlowData = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCashFlowData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCashFlowData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cashFlowData = action.payload;
            })
            .addCase(fetchCashFlowData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetCashFlowState } = cashFlowSlice.actions;
export default cashFlowSlice.reducer;
