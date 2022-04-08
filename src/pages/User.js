import Footer from '../layout/Footer'
import Header from '../layout/Header'
import Transactions from '../components/Transactions'
import { useSelector } from 'react-redux'
import { selectUser } from '../select'

/**
 * User page
 * @component
 * @category User
 */

const User = () => {
    const user = useSelector(selectUser)

    return (
        <>
            <Header />
            <main className="main bg-dark">
                <div className="header">
                    <h1>
                        Welcome back
                        <br />
                        {user.firstname} {user.lastname}!
                    </h1>
                    <button className="edit-button">Edit Name</button>
                </div>
                <h2 className="sr-only">Accounts</h2>
                <Transactions />
            </main>
            <Footer />
        </>
    )
}

export default User
