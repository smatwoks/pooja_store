
import { createSlice } from "@reduxjs/toolkit";

const initialValues = {
  allCategory: [],
  loadingCategory: false,
  allSubCategory: [],
  product: [],
};

const productSlice = createSlice({
  name: "product",
  initialState: initialValues,
  reducers: {
    setAllCategory: (state, action) => {
      state.allCategory = action.payload;
    },

    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload;
    },

    setAllSubCategory: (state, action) => {
      state.allSubCategory = action.payload;
    },

    setProduct: (state, action) => {
      state.product = action.payload;
    },

    clearCatalogCache: (state) => {
      state.allCategory = [];
      state.allSubCategory = [];
      state.product = [];
    },
  },
});

export const {
  setAllCategory,
  setLoadingCategory,
  setAllSubCategory,
  setProduct,
  clearCatalogCache,
} = productSlice.actions;

export default productSlice.reducer;
