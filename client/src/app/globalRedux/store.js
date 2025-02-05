import { configureStore } from "@reduxjs/toolkit";

// reducers
import counterReducer from "./features/counter/counterSlice";
import uiReducer from "./features/ui/uiSlice";


export const store = configureStore({
    reducer: {
        counter: counterReducer,
        ui: uiReducer,
    },
})  