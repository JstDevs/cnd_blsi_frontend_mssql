import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
    financialPerformanceData: [],
    isLoading: false,
    error: null,
};

export const fetchFinancialPerformanceData = createAsyncThunk(
    'financialPerformance/fetchFinancialPerformanceData',
    async (filters, thunkAPI) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${API_URL}/financialPerformanceReport/view`, {
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
            console.error('Error fetching financial performance data:', error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const financialPerformanceSlice = createSlice({
    name: 'financialPerformance',
    initialState,
    reducers: {
        resetFinancialPerformanceState: (state) => {
            state.financialPerformanceData = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFinancialPerformanceData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFinancialPerformanceData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.financialPerformanceData = action.payload;
            })
            .addCase(fetchFinancialPerformanceData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { resetFinancialPerformanceState } = financialPerformanceSlice.actions;
export default financialPerformanceSlice.reducer;
