import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    financialPositionData: [],
    isLoading: false,
    error: null,
};

export const fetchFinancialPositionData = createAsyncThunk(
    'financialPosition/fetchFinancialPositionData',
    async (filters, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${API_URL}/financialPositionReport/view`, {
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
            console.error('Error fetching financial position data:', error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const financialPositionSlice = createSlice({
    name: 'financialPosition',
    initialState,
    reducers: {
        resetFinancialPositionState: (state) => {
            state.financialPositionData = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFinancialPositionData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFinancialPositionData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.financialPositionData = action.payload;
            })
            .addCase(fetchFinancialPositionData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetFinancialPositionState } = financialPositionSlice.actions;
export default financialPositionSlice.reducer;
