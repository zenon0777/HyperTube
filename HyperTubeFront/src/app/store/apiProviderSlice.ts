// store/apiProviderSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface APIProviderState {
  APIProvider: string;
}

const initialState: APIProviderState = {
  APIProvider: "TMDB",
};

export const APIProviderSlice = createSlice({
  name: "APIProvider",
  initialState,
  reducers: {
    setAPIProvider: (state, action: PayloadAction<string>) => {
      state.APIProvider = action.payload;
    },
    deleteAPIProvider: (state) => {
      state.APIProvider = "TMDB";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAPIProvider, deleteAPIProvider } = APIProviderSlice.actions;

export default APIProviderSlice.reducer;