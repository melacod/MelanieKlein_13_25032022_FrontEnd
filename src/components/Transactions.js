import Transaction from './Transaction'

/**
 * User key data transactions
 * @component
 * @category User
 */

const Transactions = () => {
    return (
        <div>
            <Transaction
                title="Argent Bank Checking (x8349)"
                balance="$2,082.79"
                state="Available Balance"
            />
            <Transaction
                title="Argent Bank Savings (x6712)"
                balance="$10,928.42"
                state="Available Balance"
            />
            <Transaction
                title="Argent Bank Credit Card (x8349)"
                balance="$184.30"
                state="Current Balance"
            />
        </div>
    )
}

export default Transactions
