import Footer from '../layout/Footer'
import Header from '../layout/Header'
import Transactions from '../components/Transactions'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../select'
import { useState } from 'react'
import { updateProfile } from '../features/user'

/**
 * User profile page
 * @component
 * @category Profile
 */

const Profile = () => {
    const dispatch = useDispatch()

    const user = useSelector(selectUser)

    const [edit, setEdit] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [message, setMessage] = useState(null)

    const editClick = () => {
        setMessage(null)
        setFirstName(user.data.firstName)
        setLastName(user.data.lastName)
        setEdit(true)
    }

    const firstNameChange = (event) => {
        setFirstName(event.target.value)
    }

    const lastNameChange = (event) => {
        setLastName(event.target.value)
    }

    const saveClick = () => {
        dispatch(updateProfile(firstName, lastName))
        if (user.process.message) {
            setMessage(user.process.message)
        } else {
            setEdit(false)
        }
    }

    const cancelClick = () => {
        setMessage(null)
        setEdit(false)
    }

    return (
        <>
            <Header />
            <main className="main bg-dark">
                <div className="header">
                    <h1>
                        Welcome back
                        {edit ? (
                            ''
                        ) : (
                            <>
                                <br />
                                {user.data.firstName} {user.data.lastName}!
                            </>
                        )}
                    </h1>
                    {edit ? (
                        <>
                            <div className="edit-profile">
                                <div className="edit-profile-right">
                                    <input
                                        type="text"
                                        id="firstName"
                                        onChange={firstNameChange}
                                        defaultValue={firstName}
                                    />
                                </div>
                                <div className="edit-profile-left">
                                    <input
                                        type="text"
                                        id="lastName"
                                        onChange={lastNameChange}
                                        defaultValue={lastName}
                                    />
                                </div>
                            </div>
                            <div className="edit-profile">
                                <div className="edit-profile-right">
                                    <button
                                        className="save-button"
                                        onClick={saveClick}
                                    >
                                        Save
                                    </button>
                                </div>
                                <div className="edit-profile-left">
                                    <button
                                        className="cancel-button"
                                        onClick={cancelClick}
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {message ? <div>{message}</div> : ''}
                            </div>
                        </>
                    ) : (
                        <button className="edit-button" onClick={editClick}>
                            Edit Name
                        </button>
                    )}
                </div>
                <h2 className="sr-only">Accounts</h2>
                <Transactions />
            </main>
            <Footer />
        </>
    )
}

export default Profile
