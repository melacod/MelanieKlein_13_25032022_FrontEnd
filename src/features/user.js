import { createSlice } from '@reduxjs/toolkit'
import { selectUser } from '../select'
import BACKEND_URL from './url'

/**
 * User initial state
 * @kind constant
 * @category UserState
 */
const initialState = {
    process: {
        status: 'void',
        message: null,
        error: null,
    },
    data: {
        email: null,
        password: null,
        firstName: null,
        lastName: null,
    },
    token: null,
}

/**
 * Action to signin user
 * @function signin
 * @param {string} email user email
 * @param {string} password user password
 * @category UserState
 */
export function signin(email, password) {
    return async (dispatch, getState) => {
        // get current status
        const status = selectUser(getState()).process.status

        if (status === 'pending' || status === 'updating') {
            // if request is currently running, we stop here (to avoid trigger same request thing multiple times)
            return
        }

        // we update status to fetching
        dispatch(actions.fetching())

        try {
            // we call backend API to login the user
            //      => using method POST
            //      => with user credentials (email/password) in body
            const responseLogin = await fetch(BACKEND_URL + '/user/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            })

            // we wait for the backend response
            const dataLogin = await responseLogin.json()
            console.log('dataLogin', dataLogin)

            // if response status from login API is 200
            //      => the user is authenticated and we continue
            // else there is an error message (unknown user, bad password, ...)
            //      => we resolve the request with the error message and we stop
            if (dataLogin.status !== 200) {
                dispatch(
                    actions.resolved({
                        responseStatus: dataLogin.status,
                        process: {
                            message: dataLogin.message,
                        },
                    })
                )
                return
            }

            // add 'dummyBearer' at the beginning ot token value
            //      => this is because backend get the token using this code: headers.authorization.split('Bearer')[1].trim()
            const token = 'dummyBearer' + dataLogin.body.token

            // we call backend API to get the user profile
            //      => using method POST
            //      => with user token in header
            const responseProfile = await fetch(BACKEND_URL + '/user/profile', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })

            // we wait for the backend response
            const dataProfile = await responseProfile.json()
            console.log('dataProfile', dataProfile)

            // we resolve the request with all user information
            //      => latest response status/message (from profile response)
            //      => user token (from login response)
            //      => user profile (firstName/lastName from profile response)
            //      => user credentials (email/password from function parameters)
            dispatch(
                actions.resolved({
                    responseStatus: dataProfile.status,
                    process: {
                        message: dataProfile.message,
                        error: null,
                    },
                    data: {
                        email: email,
                        password: password,
                        firstName: dataProfile.body.firstName,
                        lastName: dataProfile.body.lastName,
                    },
                    token: token,
                })
            )
        } catch (error) {
            // if any error is catch, we reject the request with the error message
            console.log(error)
            dispatch(
                actions.rejected({
                    process: {
                        error: error.message,
                    },
                })
            )
        }
    }
}

/**
 * Action to signout user
 * @function signout
 * @category UserState
 */
export function signout() {
    return async (dispatch, getState) => {
        // get current user
        const user = selectUser(getState())

        // if a user is connected (have a token), we signout him
        if (user && user.token) {
            dispatch(actions.signout())
        }
    }
}

/**
 * Action to update user profile
 * @function updateProfile
 * @param {string} firstName new user first name
 * @param {string} lastName new user last name
 * @category UserState
 */
export function updateProfile(firstName, lastName) {
    return async (dispatch, getState) => {
        // get current user
        const user = selectUser(getState())

        // if a user is connected (have a token), we update his profile
        if (user && user.token) {
            try {
                // we call backend API to update the user profile
                //      => using method PUT
                //      => with user token in header
                //      => with new user profile (firstName/lastName) in body
                const responseUpdateProfile = await fetch(
                    BACKEND_URL + '/user/profile',
                    {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: user.token,
                        },
                        body: JSON.stringify({
                            firstName: firstName,
                            lastName: lastName,
                        }),
                    }
                )

                // we wait for the backend response
                const dataUpdateProfile = await responseUpdateProfile.json()
                console.log('dataUpdateProfile', dataUpdateProfile)

                // we update the user profile with all information
                //      => response status/message (from update profile response)
                //      => new user profile (firstName/lastName from function parameters)
                dispatch(
                    actions.update({
                        responseStatus: dataUpdateProfile.status,
                        process: {
                            message: dataUpdateProfile.message,
                        },
                        data: {
                            firstName: firstName,
                            lastName: lastName,
                        },
                    })
                )
            } catch (error) {
                // if any error is catch, we reject the request with the error message
                console.log(error)
                dispatch(
                    actions.rejected({
                        process: {
                            error: error.message,
                        },
                    })
                )
            }
        }
    }
}

/**
 * User state actions and reducers
 * @returns actions and reducers
 * @category UserState
 */
const { actions, reducer } = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // fetching action & reducer
        fetching: (draft) => {
            if (draft.process.status === 'void') {
                // no status => move to pending
                draft.process.status = 'pending'
                return
            }
            // status rejected => remove error and move to pending
            if (draft.process.status === 'rejected') {
                draft.process.error = null
                draft.process.status = 'pending'
                return
            }
            // resolved => move to updating (data are here but request still in progress)
            if (draft.process.status === 'resolved') {
                draft.process.status = 'updating'
                return
            }
            // other status => ignored
            return
        },

        // resolved action & reducer
        resolved: (draft, action) => {
            // pending or updating => move to resolved
            if (
                draft.process.status === 'pending' ||
                draft.process.status === 'updating'
            ) {
                // we clean all user information
                draft.process.status = 'resolved'
                draft.process.message = null
                draft.process.error = null
                draft.data.email = null
                draft.data.password = null
                draft.data.firstName = null
                draft.data.lastName = null
                draft.token = null

                // if status is 200 => we have user information
                // else we have an error message
                if (action.payload.responseStatus === 200) {
                    draft.data.email = action.payload.data.email
                    draft.data.password = action.payload.data.password
                    draft.data.firstName = action.payload.data.firstName
                    draft.data.lastName = action.payload.data.lastName
                    draft.token = action.payload.token
                } else {
                    draft.process.message = action.payload.process.message
                }
                return
            }

            // other status => ignored
            return
        },

        // rejected action & reducer
        rejected: (draft, action) => {
            // pending or updating => move to rejected
            if (
                draft.process.status === 'pending' ||
                draft.process.status === 'updating'
            ) {
                // we clean user information and have an error message
                draft.process.status = 'rejected'
                draft.process.message = null
                draft.process.error = action.payload.process.error
                draft.data.email = null
                draft.data.password = null
                draft.data.firstName = null
                draft.data.lastName = null
                draft.token = null
                return
            }

            // other status => ignored
            return
        },

        // signout action & reducer
        signout: (draft) => {
            // we clean user information and credentials
            draft.process.status = 'void'
            draft.process.message = null
            draft.process.error = null
            draft.data.email = null
            draft.data.password = null
            draft.data.firstName = null
            draft.data.lastName = null
            draft.token = null
        },

        // update action & reducer
        update: (draft, action) => {
            // if status is 200 => we have new user profile
            // else we have an error message
            if (action.payload.responseStatus === 200) {
                draft.process.message = null
                draft.data.firstName = action.payload.data.firstName
                draft.data.lastName = action.payload.data.lastName
            } else {
                draft.process.message = action.payload.process.message
            }
        },
    },
})

export default reducer
