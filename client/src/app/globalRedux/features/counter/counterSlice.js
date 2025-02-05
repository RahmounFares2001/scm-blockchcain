import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 0,
};

export const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state, action) => {
            state[action.payload] += 1;
        },
        decrement: (state, action) => {
            state[action.payload] -= 1;
        },
        reset: (state) => {
            state.count = 0;
        },
        incrementByAmount: (state, action) => {
            state.count += action.payload;
        },
        decrementByAmount: (state, action) => {
            state.count -= action.payload;
        },
    },
});

export const { increment, decrement, reset, incrementByAmount, decrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
