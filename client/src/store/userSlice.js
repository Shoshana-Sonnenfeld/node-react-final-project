import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  token: null,
  isManager: false, // הוספנו שדה חדש
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isManager = action.payload.isManager || false; // קבלת isManager
    },
    clearUser: (state) => {
      state.username = null;
      state.token = null;
      state.isManager = false; // איפוס גם של isManager
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;