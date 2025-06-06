import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/banks';

// Mock data for initial state
const mockBanks = [
  {
    id: 1,
    branchCode: 'BDO001',
    branch: 'BDO Makati',
    name: 'Banco de Oro',
    address: '123 Ayala Avenue, Makati City',
    accountNumber: '1234-5678-9012',
    swiftCode: 'BNORPHMM',
    iban: 'PH1234567890123456789012',
    balance: 1000000.00,
    currency: 'PHP',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    branchCode: 'BPI002',
    branch: 'BPI Ortigas',
    name: 'Bank of the Philippine Islands',
    address: '456 Ortigas Avenue, Pasig City',
    accountNumber: '9876-5432-1098',
    swiftCode: 'BOPIPHMM',
    iban: 'PH9876543210987654321098',
    balance: 2500000.00,
    currency: 'PHP',
    status: 'Active',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    branchCode: 'MBTC003',
    branch: 'Metrobank Taguig',
    name: 'Metropolitan Bank and Trust Company',
    address: '789 Bonifacio Global City, Taguig',
    accountNumber: '4567-8901-2345',
    swiftCode: 'MBTCPHMM',
    iban: 'PH4567890123456789012345',
    balance: 500000.00,
    currency: 'USD',
    status: 'Active',
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: 4,
    branchCode: 'UBP004',
    branch: 'UnionBank BGC',
    name: 'Union Bank of the Philippines',
    address: '321 5th Avenue, Bonifacio Global City',
    accountNumber: '7890-1234-5678',
    swiftCode: 'UBPPPHMM',
    iban: 'PH7890123456789012345678',
    balance: 750000.00,
    currency: 'EUR',
    status: 'Active',
    createdAt: '2024-01-04T00:00:00.000Z',
    updatedAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: 5,
    branchCode: 'RCBC005',
    branch: 'RCBC Alabang',
    name: 'Rizal Commercial Banking Corporation',
    address: '654 Alabang-Zapote Road, Muntinlupa City',
    accountNumber: '2345-6789-0123',
    swiftCode: 'RCBCPHMM',
    iban: 'PH2345678901234567890123',
    balance: 300000.00,
    currency: 'GBP',
    status: 'Inactive',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  }
];

export const fetchBanks = createAsyncThunk('banks/fetchBanks', async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    // For development, return mock data if API fails
    console.warn('API not available, using mock data:', error.message);
    return mockBanks;
  }
});

export const addBank = createAsyncThunk('banks/addBank', async (bank) => {
  try {
    const response = await axios.post(API_URL, bank);
    return response.data;
  } catch (error) {
    // For development, simulate API response
    console.warn('API not available, using mock data:', error.message);
    // Generate a new ID based on existing banks
    const newId = Math.max(...mockBanks.map(b => b.id)) + 1;
    return {
      ...bank,
      id: newId,
      status: bank.status || 'Active'
    };
  }
});

export const updateBank = createAsyncThunk('banks/updateBank', async (bank) => {
  try {
    const response = await axios.put(`${API_URL}/${bank.id}`, bank);
    return response.data;
  } catch (error) {
    // For development, return the updated bank
    return bank;
  }
});

export const deleteBank = createAsyncThunk('banks/deleteBank', async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    // For development, just return the id
    return id;
  }
});

const bankSlice = createSlice({
  name: 'banks',
  initialState: {
    banks: mockBanks,
    isLoading: false,
    error: null,
    selectedBank: null,
    filters: {
      status: 'all',
      search: '',
    },
    sort: {
      field: 'name',
      direction: 'asc',
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banks = action.payload;
      })
      .addCase(fetchBanks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addBank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBank.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.banks)) {
          state.banks = [];
        }
        state.banks.push(action.payload);
        state.error = null;
      })
      .addCase(addBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateBank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBank.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.banks.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.banks[idx] = action.payload;
      })
      .addCase(updateBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteBank.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banks = state.banks.filter(b => b.id !== action.payload);
      })
      .addCase(deleteBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default bankSlice.reducer; 