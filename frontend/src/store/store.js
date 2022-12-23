import { createSlice, configureStore } from "@reduxjs/toolkit";

const authInitialState = {
    token: null,
    userId: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState: authInitialState,
    reducers: {
        login(state, action) {
            state.token = action.payload.token
            state.userId = action.payload.userId
            state.isLoggedIn = true
            localStorage.setItem('userData', JSON.stringify({
                userId: action.payload.userId,
                token: action.payload.token
            }))
        },
        logout(state) {
            state.token = null
            state.userId = null
            state.isLoggedIn = false
            localStorage.removeItem('userData')
        }
    }
})

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
});
export const authActions = authSlice.actions;
export default store;
