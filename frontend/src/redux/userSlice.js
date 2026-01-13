import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const savedToken = localStorage.getItem("token") || null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: savedUser,
    token: savedToken
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
