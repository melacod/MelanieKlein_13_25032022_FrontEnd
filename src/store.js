import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user'

/**
 * Redux store
 * @kind constant
 * @category Store
 */
const store = configureStore({
    reducer: {
        user: userReducer,
    },
})

// we log the state in the console each time it is modified
store.subscribe(() => {
    console.log('New state', store.getState())
})

export default store
