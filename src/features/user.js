import { createSlice } from '@reduxjs/toolkit'
import { selectUser } from '../select'

const BACKEND_URL = 'http://localhost:3001/api/v1'

// user state

const initialState = {
    // user data loading
    status: 'void',
    message: null,
    error: null,
    // user data
    email: null,
    password: null,
    token: null,
    firstName: null,
    lastName: null,
    rememberMe: false,
}

export function signin(email, password, rememberMe) {
    return async (dispatch, getState) => {
        // on regarde le statut actuel
        const status = selectUser(getState()).status

        if (status === 'pending' || status === 'updating') {
            // on stop la fonction pour éviter de récupérer plusieurs fois la même donnée
            return
        }

        // on indique qu'on est en train de charger les données
        dispatch(actions.fetching())

        try {
            // on utilise fetch pour faire la requête login
            const responseLogin = await fetch(BACKEND_URL + '/user/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                // l'API nécessite email/password
                body: JSON.stringify({ email, password }),
            })

            // on attend la réponse de login et on la loggue dans la console
            let dataLogin = await responseLogin.json()
            console.log('dataLogin', dataLogin)

            // si la réponse n'est pas bonne (statut différent de 200), on arrête
            // la réponse contient le message indiquant pourquoi le staut n'est pas bon
            //      exemples : mauvais mot de passe, utilisateur qui n'existe pas, ...
            if (dataLogin.status !== 200) {
                dispatch(actions.resolved(dataLogin))
                return
            }

            // on utilise fetch pour faire la requête profile utilisateur
            const responseProfile = await fetch(BACKEND_URL + '/user/profile', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    // on passe le token autorisation récupéré de la réponse de login
                    Authorization: dataLogin.body.token,
                },
            })

            // on attend la réponse de profile et on la loggue dans la console
            const dataProfile = await responseProfile.json()
            console.log('dataProfile', dataProfile)

            // on indique que le process est terminé et on passe un objet qui contiendra toutes les informations
            //  - le statut et le message de la dernière répoonse (profile)
            //  - le token issu du body de la réponse de login
            //  - l'email, le firstName et le lastName de la réponse de profile
            //  - le password et rememberMe (paramètres de la function)
            dispatch(
                actions.resolved({
                    status: dataProfile.status,
                    message: dataProfile.message,
                    ...dataLogin.body,
                    ...dataProfile.body,
                    password,
                    rememberMe,
                })
            )
        } catch (error) {
            dispatch(actions.rejected(error.message))
        }
    }
}

export function signout() {
    return async (dispatch, getState) => {
        const user = selectUser(getState())
        if (user && user.token) {
            dispatch(actions.signout())
        }
    }
}

const { actions, reducer } = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // fetching action & reducer
        fetching: (draft) => {
            if (draft.status === 'void') {
                // on passe en pending
                draft.status = 'pending'
                return
            }
            // si le statut est rejected
            if (draft.status === 'rejected') {
                // on supprime l'erreur et on passe en pending
                draft.error = null
                draft.status = 'pending'
                return
            }
            // si le statut est resolved
            if (draft.status === 'resolved') {
                // on passe en updating (requête en cours mais des données sont déjà présentent)
                draft.status = 'updating'
                return
            }
            // sinon l'action est ignorée
            return
        },
        // resolved action & reducer
        resolved: (draft, action) => {
            // si la requête est en cours
            if (draft.status === 'pending' || draft.status === 'updating') {
                // on passe en resolved et on sauvegarde les données si on le statut ok (200)
                draft.message = action.payload.message
                draft.email = null
                draft.password = null
                draft.token = null
                draft.firstName = null
                draft.lastName = null
                if (action.payload.status === 200) {
                    draft.email = action.payload.email
                    draft.password = action.payload.password
                    draft.token = action.payload.token
                    draft.firstName = action.payload.firstName
                    draft.lastName = action.payload.lastName
                    draft.rememberMe = action.payload.rememberMe
                }
                draft.status = 'resolved'
                return
            }
            // sinon l'action est ignorée
            return
        },
        // rejected action & reducer
        rejected: (draft, action) => {
            // si la requête est en cours
            if (draft.status === 'pending' || draft.status === 'updating') {
                // on passe en rejected, on sauvegarde l'erreur et on supprime les données
                draft.status = 'rejected'
                draft.message = null
                draft.error = action.payload

                draft.email = null
                draft.password = null
                draft.token = null
                draft.firstName = null
                draft.lastName = null
                return
            }
            // sinon l'action est ignorée
            return
        },
        signout: (draft, action) => {
            draft.status = 'void'
            draft.message = null
            draft.error = null
            draft.email = draft.rememberMe ? draft.email : null
            draft.password = draft.rememberMe ? draft.password : null
            draft.token = null
            draft.firstName = null
            draft.lastName = null
        },
    },
})

export default reducer
