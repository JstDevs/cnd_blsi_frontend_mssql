import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockTickets = [];

export const fetchPublicMarketTickets = createAsyncThunk(
  'publicMarketTicketing/fetchPublicMarketTickets',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/public-market-ticketing`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch public market tickets');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPublicMarketTicketById = createAsyncThunk(
  'publicMarketTicketing/fetchPublicMarketTicketById',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/public-market-ticketing/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch public market ticket');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addPublicMarketTicket = createAsyncThunk(
  'publicMarketTicketing/addPublicMarketTicket',
  async (ticketData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/public-market-ticketing/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to add public market ticket');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePublicMarketTicket = createAsyncThunk(
  'publicMarketTicketing/public-market-ticketing',
  async (ticketData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/publicMarketTicketing/${ticketData.ID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ticketData),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to update public market ticket');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deletePublicMarketTicket = createAsyncThunk(
  'publicMarketTicketing/deletePublicMarketTicket',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/public-market-ticketing/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to delete public market ticket'
        );
      }

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const publicMarketTicketingSlice = createSlice({
  name: 'publicMarketTicketing',
  initialState: {
    tickets: [],
    currentTicket: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicMarketTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicMarketTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPublicMarketTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch public market tickets';
        console.warn('Failed to fetch tickets, using mock data.', state.error);
        state.tickets = mockTickets;
      })
      .addCase(fetchPublicMarketTicketById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicMarketTicketById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchPublicMarketTicketById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch public market ticket';
      })
      .addCase(addPublicMarketTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPublicMarketTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.tickets)) {
          state.tickets = [];
        }
        state.tickets.push(action.payload);
      })
      .addCase(addPublicMarketTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add public market ticket';
        console.error('Failed to add ticket:', state.error);
      })
      .addCase(updatePublicMarketTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePublicMarketTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tickets.findIndex(
          (item) => item.ID === action.payload.ID
        );
        if (index !== -1) {
          if (!Array.isArray(state.tickets)) {
            state.tickets = [];
          }
          state.tickets[index] = action.payload;
        }
        if (
          state.currentTicket &&
          state.currentTicket.ID === action.payload.ID
        ) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(updatePublicMarketTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update public market ticket';
        console.error('Failed to update ticket:', state.error);
      })
      .addCase(deletePublicMarketTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePublicMarketTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.tickets)) {
          state.tickets = [];
        }
        state.tickets = state.tickets.filter(
          (item) => item.ID !== action.payload
        );
        if (state.currentTicket && state.currentTicket.ID === action.payload) {
          state.currentTicket = null;
        }
      })
      .addCase(deletePublicMarketTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete public market ticket';
        console.error('Failed to delete ticket:', state.error);
      });
  },
});

export const { clearCurrentTicket } = publicMarketTicketingSlice.actions;
export const publicMarketTicketingReducer = publicMarketTicketingSlice.reducer;
