import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../select'
import { signout } from '../store'

/**
 * Page navigation
 * @component
 * @category Common
 */
const Navigation = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(selectUser)

    const handleSignout = (event) => {
        event.preventDefault()
        dispatch(signout())
        navigate('/')
    }

    if (user && user.connected) {
        return (
            <div>
                <Link className="main-nav-item" to="/user">
                    <i className="fa fa-user-circle"></i>
                    {user.username}
                </Link>
                <a className="main-nav-item" href="/" onClick={handleSignout}>
                    <i className="fa fa-sign-out"></i>
                    Sign Out
                </a>
            </div>
        )
    }

    return (
        <div>
            <Link to="/signin" className="main-nav-item">
                <i className="fa fa-user-circle"></i>
                Sign In
            </Link>
        </div>
    )
}

export default Navigation
