import { createSlice } from '@reduxjs/toolkit'
import { selectUser } from '../select'

const BACKEND_URL = 'http://localhost:3001/api/v1'

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

export function signin(email, password, rememberMe) {
    return async (dispatch, getState) => {
        // on regarde le statut actuel
        const status = selectUser(getState()).process.status

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
                body: JSON.stringify({ email: email, password: password }),
            })

            // on attend la réponse de login et on la loggue dans la console
            const dataLogin = await responseLogin.json()
            console.log('dataLogin', dataLogin)

            // si la réponse n'est pas bonne (statut différent de 200), on arrête
            // la réponse contient le message indiquant pourquoi le staut n'est pas bon
            //      exemples : mauvais mot de passe, utilisateur qui n'existe pas, ...
            if (dataLogin.status !== 200) {
                dispatch(
                    actions.resolved({
                        respponseStatus: dataLogin.status,
                        process: {
                            message: dataLogin.message,
                        },
                    })
                )
                return
            }

            // on ajoute Bearer et un prefixe factice (dummy) pour que le backend fonctionne
            // le backend récupère le token d'autorization avec: headers.authorization.split('Bearer')[1].trim()
            const token = 'dummyBearer' + dataLogin.body.token

            // on utilise fetch pour faire la requête profile utilisateur
            const responseProfile = await fetch(BACKEND_URL + '/user/profile', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    // on passe le token autorisation
                    Authorization: token,
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
                    respponseStatus: dataProfile.status,
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

export function signout() {
    return async (dispatch, getState) => {
        const user = selectUser(getState())
        if (user && user.token) {
            dispatch(actions.signout())
        }
    }
}

export function updateProfile(firstName, lastName) {
    return async (dispatch, getState) => {
        const user = selectUser(getState())
        if (user && user.token) {
            // on utilise fetch pour faire la requête de mise a jour du profile utilisateur
            const responseUpdateProfile = await fetch(
                BACKEND_URL + '/user/profile',
                {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        // on passe le token autorisation
                        Authorization: user.token,
                    },
                    // l'API nécessite firstName/lastName
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                    }),
                }
            )

            // on attend la réponse de profile et on la loggue dans la console
            const dataUpdateProfile = await responseUpdateProfile.json()
            console.log('dataUpdateProfile', dataUpdateProfile)

            dispatch(
                actions.update({
                    respponseStatus: dataUpdateProfile.status,
                    process: {
                        message: dataUpdateProfile.message,
                    },
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                    },
                })
            )
        }
    }
}

const { actions, reducer } = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // fetching action & reducer
        fetching: (draft) => {
            if (draft.process.status === 'void') {
                // on passe en pending
                draft.process.status = 'pending'
                return
            }
            // si le statut est rejected
            if (draft.process.status === 'rejected') {
                // on supprime l'erreur et on passe en pending
                draft.process.error = null
                draft.process.status = 'pending'
                return
            }
            // si le statut est resolved
            if (draft.process.status === 'resolved') {
                // on passe en updating (requête en cours mais des données sont déjà présentent)
                draft.process.status = 'updating'
                return
            }
            // sinon l'action est ignorée
            return
        },
        // resolved action & reducer
        resolved: (draft, action) => {
            // si la requête est en cours
            if (
                draft.process.status === 'pending' ||
                draft.process.status === 'updating'
            ) {
                // on passe en resolved et on sauvegarde les données si on le statut ok (200)
                draft.process.status = 'resolved'
                draft.process.message = null
                draft.process.error = null
                draft.data.email = null
                draft.data.password = null
                draft.data.firstName = null
                draft.data.lastName = null
                draft.token = null
                if (action.payload.respponseStatus === 200) {
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
            // sinon l'action est ignorée
            return
        },
        // rejected action & reducer
        rejected: (draft, action) => {
            // si la requête est en cours
            if (
                draft.process.status === 'pending' ||
                draft.process.status === 'updating'
            ) {
                // on passe en rejected, on sauvegarde l'erreur et on supprime les données
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
            // sinon l'action est ignorée
            return
        },
        signout: (draft) => {
            draft.process.status = 'void'
            draft.process.message = null
            draft.process.error = null
            draft.data.email = null
            draft.data.password = null
            draft.data.firstName = null
            draft.data.lastName = null
            draft.token = null
        },
        update: (draft, action) => {
            if (action.payload.respponseStatus === 200) {
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
