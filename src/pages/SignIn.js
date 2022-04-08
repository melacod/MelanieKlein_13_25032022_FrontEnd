import SignInModal from '../components/SignInModal'
import Footer from '../layout/Footer'
import Header from '../layout/Header'
import MainBlack from '../layout/MainBlack'

/**
 * SignIn page
 * @component
 * @category SignIn
 */

const SignIn = () => {
    return (
        <>
            <Header />
            <main className="main bg-dark">
                <SignInModal />
            </main>
            <Footer />
        </>
    )
}

export default SignIn
