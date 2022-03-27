const Transaction = ({ title, balance, state }) => {
    return (
        <section class="account">
            <div class="account-content-wrapper">
                <h3 class="account-title">{title}</h3>
                <p class="account-amount">{balance}</p>
                <p class="account-amount-description">{state}</p>
            </div>
            <div class="account-content-wrapper cta">
                <button class="transaction-button">View transactions</button>
            </div>
        </section>
    )
}

export default Transaction
