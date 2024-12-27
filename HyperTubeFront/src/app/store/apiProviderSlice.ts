import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface APIProviderState {
  APIProvider: string | "YTS";
}

const initialState: APIProviderState = {
  APIProvider: "YTS",
};

export const APIProviderSlice = createSlice({
  name: "APIProvider",
  initialState,
  reducers: {
    setAPIProvider: (state : any, action: PayloadAction<APIProviderState>) => {
      state.APIProvider = action.payload.APIProvider;
    },
    deleteAPIProvider: (state : any) => {
      state.APIProvider = "YTS";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAPIProvider, deleteAPIProvider } = APIProviderSlice.actions;

export default APIProviderSlice.reducer;
