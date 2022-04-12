import { createStore } from 'redux'
import produce from 'immer'

// state
const initialState = {
    user: {
        connected: false,
        username: null,
        password: null,
        firstname: null,
        lastname: null,
        rememberMe: false,
    },
}

// actions creators

export const signin = (user) => ({
    type: 'signin',
    payload: { user: user },
})

export const signout = () => ({
    type: 'signout',
})

// reducer

function reducer(state = initialState, action) {
    if (action.type === 'signout') {
        if (state.user.rememberMe) {
            return produce(state, (draft) => {
                draft.user.connected = false
                draft.user.firstname = null
                draft.user.lastname = null
            })
        }
        return initialState
    }
    if (action.type === 'signin') {
        return produce(state, (draft) => {
            draft.user = action.payload.user
        })
    }
    return state
}

// store

export const store = createStore(reducer)

// follow state evolution

store.subscribe(() => {
    console.log('New state', store.getState())
})
