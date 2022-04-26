import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../select'
import { signout } from '../features/user'

/**
 * Navigation bar
 * @component
 * @category Common
 */
const Navigation = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // get the user from the store
    const user = useSelector(selectUser)

    // handle signout action
    const handleSignout = (event) => {
        event.preventDefault()
        dispatch(signout())
        navigate('/')
    }

    // if a user is connected, show user icon and signout link
    if (user && user.token) {
        return (
            <div>
                <Link className="main-nav-item" to="/user">
                    <i className="fa fa-user-circle"></i>
                    {user.data.firstName}
                </Link>
                <a className="main-nav-item" href="/" onClick={handleSignout}>
                    <i className="fa fa-sign-out"></i>
                    Sign Out
                </a>
            </div>
        )
    }

    // if no user connected, show signin link
    return (
        <div>
            <Link to="/login" className="main-nav-item">
                <i className="fa fa-user-circle"></i>
                Sign In
            </Link>
        </div>
    )
}

export default Navigation
