import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showSideBar: true,
    showHoveredSideBar: false,
    dropProfileMenu: false,
};

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setUi: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value;
        },
    },
});

// Example usage: dispatch(setUi({ key: "showAuthSection", value: true }));

export const { setUi } = uiSlice.actions;
export default uiSlice.reducer;
