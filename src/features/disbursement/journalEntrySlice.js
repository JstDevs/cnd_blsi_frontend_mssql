import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockJournalEntries = [];
export const fetchJournalEntries = createAsyncThunk(
  'journalEntries/fetchJournalEntries',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/journalEntryVoucher`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message || 'Failed to fetch');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addJournalEntry = createAsyncThunk(
  'journalEntries/addJournalEntry',
  async (journalEntry, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/journalentryvoucher`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: journalEntry,
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateJournalEntry = createAsyncThunk(
  'journalEntries/updateJournalEntry',
  async ({ journalEntry, id }, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/journalEntryVoucher/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(journalEntry),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to update');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journalEntries/deleteJournalEntry',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(
        `${API_URL}/journalEntryVoucher/?LinkID=${ID}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || 'Failed to delete'
        );
      }

      return ID; // Return ID so you can remove it from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const journalEntriesSlice = createSlice({
  name: 'journalEntries',
  initialState: {
    journalEntries: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJournalEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.journalEntries = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch journal entries';
        console.warn(
          'Failed to fetch journal entries, using mock data.',
          state.error
        );
        state.journalEntries = mockJournalEntries;
      })
      .addCase(addJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.journalEntries)) {
          state.journalEntries = [];
        }
        state.journalEntries.push(action.payload);
      })
      .addCase(addJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add journal entry';
        console.error('Failed to add journal entry:', state.error);
      })
      .addCase(updateJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.journalEntries.findIndex(
          (item) => item.ID === action.payload.ID
        );
        if (index !== -1) {
          if (!Array.isArray(state.journalEntries)) {
            state.journalEntries = [];
          }
          state.journalEntries[index] = action.payload;
        }
      })
      .addCase(deleteJournalEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.journalEntries)) {
          state.journalEntries = [];
        }
        state.journalEntries = state.journalEntries.filter(
          (item) => item.ID !== action.payload
        );
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete journal entry';
        console.error('Failed to delete journal entry:', state.error);
      });
  },
});

export const journalEntriesReducer = journalEntriesSlice.reducer;
