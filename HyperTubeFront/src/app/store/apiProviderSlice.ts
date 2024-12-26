import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface APIProviderState {
  APIProvider: string | null;
}

const initialState: APIProviderState = {
  APIProvider: null,
};

export const APIProviderSlice = createSlice({
  name: "APIProvider",
  initialState,
  reducers: {
    setAPIProvider: (state : any, action: PayloadAction<APIProviderState>) => {
      state.APIProvider = action.payload;
    },
    deleteAPIProvider: (state : any) => {
      state.APIProvider = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAPIProvider, deleteAPIProvider } = APIProviderSlice.actions;

export default APIProviderSlice.reducer;
