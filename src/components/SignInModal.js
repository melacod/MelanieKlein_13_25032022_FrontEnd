import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signin } from '../store'

/**
 * User key data cards
 * @component
 * @category SignIn
 */
const SignInModal = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const usernameChange = (event) => {
        setUsername(event.target.value)
    }

    const passwordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        // call to backend api to authenticate user
        dispatch(
            signin({
                connected: true,
                username: username,
                password: password,
                firstname: 'Mélanie',
                lastname: 'Klein',
            })
        )
        navigate('/user')
    }

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
                        onChange={usernameChange}
                    />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={passwordChange}
                    />
                </div>
                <div className="input-remember">
                    <input type="checkbox" id="remember-me" />
                    <label htmlFor="remember-me">Remember me</label>
                </div>
                <button className="sign-in-button">Sign In</button>
            </form>
        </section>
    )
}

export default SignInModal
