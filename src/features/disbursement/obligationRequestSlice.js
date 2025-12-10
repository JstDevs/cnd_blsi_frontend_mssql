import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  obligationRequests: [],
  obligationRequest: null,
  isLoading: false,
  error: null,
};

// Thunks for API calls

export const fetchObligationRequests = createAsyncThunk(
  'obligationRequests/fetchObligationRequests',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/obligationRequest`, {
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

export const fetchObligationRequestById = createAsyncThunk(
  'obligationRequests/fetchById',
  async (id, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const state = thunkAPI.getState();
          const request = state.obligationRequests.obligationRequests.find(ors => ors.id === id);
          if (request) {
            resolve(request);
          } else {
            reject(new Error('Obligation request not found'));
          }
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const createObligationRequest = createAsyncThunk(
  'obligationRequests/create',
  async (obligationRequest, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/obligationRequest`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: obligationRequest,
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || res.message || 'Failed to add');
      }

      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// export const createObligationRequest = createAsyncThunk(
//   'obligationRequests/create',
//   async (obligationRequest, thunkAPI) => {
//     try {
//       // Simulate API call
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           const newRequest = {
//             ...obligationRequest,
//             id: Date.now(),
//             orsNumber: `ORS-2024-01-${String(Math.floor(Math.random() * 9000) + 1000)}`,
//             dateCreated: new Date().toISOString(),
//             status: 'Pending',
//           };
//           resolve(newRequest);
//         }, 500);
//       });
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const updateObligationRequest = createAsyncThunk(
  'obligationRequests/update',
  async (obligationRequest, thunkAPI) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(obligationRequest);
        }, 500);
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const obligationRequestSlice = createSlice({
  name: 'obligationRequests',
  initialState,
  reducers: {
    resetObligationRequestState: (state) => {
      state.obligationRequest = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all obligation requests
      .addCase(fetchObligationRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchObligationRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.obligationRequests = action.payload;
      })
      .addCase(fetchObligationRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single obligation request
      .addCase(fetchObligationRequestById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchObligationRequestById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.obligationRequest = action.payload;
      })
      .addCase(fetchObligationRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create obligation request
      .addCase(createObligationRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createObligationRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.obligationRequests.push(action.payload);
      })
      .addCase(createObligationRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update obligation request
      .addCase(updateObligationRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateObligationRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.obligationRequests.findIndex(
          (ors) => ors.id === action.payload.id
        );
        if (index !== -1) {
          state.obligationRequests[index] = action.payload;
        }
      })
      .addCase(updateObligationRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetObligationRequestState } = obligationRequestSlice.actions;
export default obligationRequestSlice.reducer;