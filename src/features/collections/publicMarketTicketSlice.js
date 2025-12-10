import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const addTicket = createAsyncThunk(
  'publicMarketTicket/addTicket',
  async (ticketData) => {
    // TODO: Replace with actual API call
    return ticketData;
  }
);

export const updateTicket = createAsyncThunk(
  'publicMarketTicket/updateTicket',
  async ({ id, ...ticketData }) => {
    // TODO: Replace with actual API call
    return { id, ...ticketData };
  }
);

export const deleteTicket = createAsyncThunk(
  'publicMarketTicket/deleteTicket',
  async (id) => {
    // TODO: Replace with actual API call
    return id;
  }
);

const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

const publicMarketTicketSlice = createSlice({
  name: 'publicMarketTicket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Ticket
      .addCase(addTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push(action.payload);
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Ticket
      .addCase(updateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Ticket
      .addCase(deleteTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default publicMarketTicketSlice.reducer; 