import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  selectedOrder: TOrder | null;
  isLoading: boolean;
  isLoadingOrder: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  selectedOrder: null,
  isLoading: false,
  isLoadingOrder: false,
  error: null
};

// Thunk для получения данных ленты заказов
export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки ленты заказов');
    }
  }
);

// Thunk для загрузки заказа по ID
export const fetchOrderById = createAsyncThunk(
  'feed/fetchOrderById',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(id);
      return data.orders[0];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки заказа');
    }
  }
);

// Slice для ленты заказов
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null; // Очищаем выбранный заказ
    }
  },
  extraReducers: (builder) => {
    // Обработка ленты заказов
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обработка выбранного заказа
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoadingOrder = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoadingOrder = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoadingOrder = false;
        state.error = action.payload as string;
      });
  }
});

// Экспортируем actions и reducer
export const { clearSelectedOrder } = feedSlice.actions;

export default feedSlice.reducer;
