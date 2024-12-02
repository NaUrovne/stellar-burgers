import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi, orderBurgerApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

interface IngredientsState {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
  bun: TIngredient | null;
  ingredients: TIngredient[];
  orderRequest: boolean; // Для отслеживания запроса
  orderModalData: { orderNumber: number } | null; // Данные модального окна
}

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null,
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

// Создаем Thunk для получения данных ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки ингредиентов');
    }
  }
);

export const placeOrder = createAsyncThunk<number, string[]>(
  'ingredients/placeOrder',
  async (ingredientsIds, { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientsIds);
      return data.order.number; //возвращаем номер заказа
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка оформления заказа');
    }
  }
);

// Создаем Slice
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearOrderModal(state) {
      state.orderModalData = null;
    },
    setBun(state, action) {
      state.bun = action.payload;
    },
    addIngredient(state, action) {
      state.ingredients.push(action.payload);
    },
    removeIngredient(state, action) {
      state.ingredients = state.ingredients.filter(
        (ingredient, index) => index !== action.payload
      );
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredientUp(state, action) {
      const index = action.payload;
      if (index > 0) {
        const ingredients = [...state.ingredients];
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
        state.ingredients = ingredients;
      }
    },
    moveIngredientDown(state, action) {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const ingredients = [...state.ingredients];
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ];
        state.ingredients = ingredients;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(placeOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = { orderNumber: action.payload };
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  clearConstructor,
  clearOrderModal,
  moveIngredientUp,
  moveIngredientDown
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
