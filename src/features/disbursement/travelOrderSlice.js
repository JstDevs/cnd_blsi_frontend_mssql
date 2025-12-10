import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;

// Mock Data
const mockTravelOrders = [];
export const fetchTravelOrders = createAsyncThunk(
  'travelOrders/fetchTravelOrders',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/travelOrder`, {
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

export const addTravelOrder = createAsyncThunk(
  'travelOrders/addTravelOrder',
  async (travelOrder, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/travelOrder`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          // DO NOT set 'Content-Type' when sending FormData
        },
        body: travelOrder, // travelOrder is already a FormData object
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


// export const updateTravelOrder = createAsyncThunk(
//   'travelOrders/updateTravelOrder',
//   async (travelOrder, thunkAPI) => {
//     try {
//       const response = await fetch(`${API_URL}/travelOrder/${travelOrder.ID}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(travelOrder),
//       });

//       const res = await response.json();

//       if (!response.ok) {
//         throw new Error(res.message || 'Failed to update');
//       }

//       return res;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

export const updateTravelOrder = createAsyncThunk(
  'travelOrders/updateTravelOrder',
  async (travelOrder, thunkAPI) => {
    try {
      let id;
      let options = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: null,
      };

      if (travelOrder instanceof FormData) {
        // Extract ID from FormData and remove it to avoid duplication
        id = travelOrder.get('ID');
        travelOrder.delete('ID'); // remove from body
        options.body = travelOrder;
      } else {
        // JSON case
        id = travelOrder.ID;
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(travelOrder);
      }

      const response = await fetch(`${API_URL}/travelOrder/${id}`, options);
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



export const deleteTravelOrder = createAsyncThunk(
  'travelOrders/deleteTravelOrder',
  async (ID, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/travelOrder/${ID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to delete');
      }

      return ID;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const travelOrdersSlice = createSlice({
  name: 'travelOrders',
  initialState: {
    travelOrders: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTravelOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.travelOrders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTravelOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch travel orders';
        console.warn('Failed to fetch travel orders, using mock data.', state.error);
        state.travelOrders = mockTravelOrders;
      })
      .addCase(addTravelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTravelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.travelOrders)) {
          state.travelOrders = [];
        }
        state.travelOrders.push(action.payload);
      })
      .addCase(addTravelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add travel order';
        console.error('Failed to add travel order:', state.error);
      })
      .addCase(updateTravelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTravelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.travelOrders.findIndex(item => item.ID === action.payload.ID);
        if (index !== -1) {
          if (!Array.isArray(state.travelOrders)) {
            state.travelOrders = [];
          }
          state.travelOrders[index] = action.payload;
        }
      })
      .addCase(deleteTravelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTravelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!Array.isArray(state.travelOrders)) {
          state.travelOrders = [];
        }
        state.travelOrders = state.travelOrders.filter(item => item.ID !== action.payload);
      })
      .addCase(deleteTravelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete travel order';
        console.error('Failed to delete travel order:', state.error);
      });
  },
});

export const travelOrderReducer = travelOrdersSlice.reducer;