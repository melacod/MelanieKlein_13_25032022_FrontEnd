import Logo from '../assets/Logo'
import Navigation from './Navigation'

/**
 * Header
 * @component
 * @category Common
 */
const Header = () => {
    return (
        <nav className="main-nav">
            <Logo />
            <Navigation />
        </nav>
    )
}

export default Header
