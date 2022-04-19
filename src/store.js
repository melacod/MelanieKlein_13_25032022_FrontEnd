import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user'

// on définit le store en utilisant le toolkit redux
const store = configureStore({
    reducer: {
        user: userReducer,
    },
})

// on logue les changements de l'état dans la console à chaque modification
store.subscribe(() => {
    console.log('New state', store.getState())
})

export default store
