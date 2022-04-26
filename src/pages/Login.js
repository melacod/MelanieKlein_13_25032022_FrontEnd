import LoginForm from '../components/LoginForm'
import Footer from '../layout/Footer'
import Header from '../layout/Header'

/**
 * Login page
 * @component
 * @category Login
 */
const Login = () => {
    return (
        <>
            <Header />
            <main className="main bg-dark">
                <LoginForm />
            </main>
            <Footer />
        </>
    )
}

export default Login
