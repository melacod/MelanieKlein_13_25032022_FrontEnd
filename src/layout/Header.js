import Logo from '../assets/Logo'
import Navigation from './Navigation'

/**
 * Page header
 * @component
 * @category Common
 */

const Header = () => {
    return (
        <nav class="main-nav">
            <Logo />
            <Navigation />
        </nav>
    )
}

export default Header
