import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signin } from '../store'
import { useSelector } from 'react-redux'
import { selectUser } from '../select'
import { useEffect } from 'react'

/**
 * User key data cards
 * @component
 * @category SignIn
 */
const SignInModal = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(selectUser)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    useEffect(() => {
        if (user.rememberMe) {
            setUsername(user.username)
            setPassword(user.password)
            setRememberMe(user.rememberMe)
        }
    }, [user])

    const usernameChange = (event) => {
        setUsername(event.target.value)
    }

    const passwordChange = (event) => {
        setPassword(event.target.value)
    }

    const rememberMeChange = (event) => {
        setRememberMe(event.target.checked)
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
                rememberMe: rememberMe,
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
                        defaultValue={username}
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
            </form>
        </section>
    )
}

export default SignInModal
