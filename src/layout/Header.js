import { Link } from 'react-router-dom'
import Logo from '../assets/Logo'
import Navigation from './Navigation'

const Header = () => {
    return (
        <header>
            <div className="logo">
                <Link to="/index">
                    <Logo />
                </Link>
            </div>
            <Navigation />
        </header>
    )
}

export default Header