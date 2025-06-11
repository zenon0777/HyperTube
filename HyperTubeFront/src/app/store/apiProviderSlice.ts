import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface APIProviderState {
  APIProvider: string | "TMDB";
}

const initialState: APIProviderState = {
  APIProvider: "TMDB",
};

export const APIProviderSlice = createSlice({
  name: "APIProvider",
  initialState,
  reducers: {
    setAPIProvider: (state : any, action: PayloadAction<APIProviderState>) => {
      state.APIProvider = action.payload.APIProvider;
    },
    deleteAPIProvider: (state : any) => {
      state.APIProvider = "TMDB";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAPIProvider, deleteAPIProvider } = APIProviderSlice.actions;

export default APIProviderSlice.reducer;
