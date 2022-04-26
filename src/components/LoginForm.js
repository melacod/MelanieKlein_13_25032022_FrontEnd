import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../select'
import { useEffect } from 'react'
import { signin } from '../features/user'

/**
 * User login form
 * @component
 * @category Login
 */
const LoginForm = () => {
    const dispatch = useDispatch()

    // get the user from the store
    const user = useSelector(selectUser)

    // state variables for the form
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    // initialize form fields with values saved in local storage if any
    useEffect(() => {
        if (localStorage.getItem('user.email')) {
            setEmail(localStorage.getItem('user.email'))
            setPassword(localStorage.getItem('user.password'))
            setRememberMe(true)
        }
    }, [])

    // handle email change event
    const emailChange = (event) => {
        setEmail(event.target.value)
    }

    // handle password change event
    const passwordChange = (event) => {
        setPassword(event.target.value)
    }

    // handle remember me change event
    const rememberMeChange = (event) => {
        setRememberMe(event.target.checked)
    }

    // handle login action (form submit)
    const handleSubmit = (event) => {
        event.preventDefault()
        // if remember me is choosen, save values to local storage
        // else remove values from local storage
        if (rememberMe) {
            localStorage.setItem('user.email', email)
            localStorage.setItem('user.password', password)
        } else {
            localStorage.removeItem('user.email')
            localStorage.removeItem('user.password')
        }
        dispatch(signin(email, password))
    }

    // if a user is connected, go to profile page
    if (user && user.token) {
        return <Navigate replace to="/profile" />
    }

    // if no user connected, show login form
    return (
        <section className="sign-in-content">
            <i className="fa fa-user-circle sign-in-icon"></i>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        onChange={emailChange}
                        defaultValue={email}
                    />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={passwordChange}
                        defaultValue={password}
                    />
                </div>
                <div className="input-remember">
                    <input
                        type="checkbox"
                        id="remember-me"
                        onChange={rememberMeChange}
                        checked={rememberMe}
                    />
                    <label htmlFor="remember-me">Remember me</label>
                </div>
                <button className="sign-in-button">Sign In</button>
                {user && user.process.message ? (
                    <div style={{ color: 'red' }}>{user.process.message}</div>
                ) : user && user.process.error ? (
                    <div style={{ color: 'darkred' }}>{user.process.error}</div>
                ) : (
                    ''
                )}
            </form>
        </section>
    )
}

export default LoginForm
