import Footer from '../layout/Footer'
import Header from '../layout/Header'
import Transactions from '../components/Transactions'

const User = () => {
    return (
        <>
            <Header />
            <main class="main bg-dark">
                <div class="header">
                    <h1>
                        Welcome back
                        <br />
                        Tony Jarvis!
                    </h1>
                    <button class="edit-button">Edit Name</button>
                </div>
                <h2 class="sr-only">Accounts</h2>
                <Transactions />
            </main>
            <Footer />
        </>
    )
}

export default User
