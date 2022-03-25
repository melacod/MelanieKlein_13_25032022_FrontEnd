import Card from './Card'

const Cards = () => {
    return (
        <div class="features">
            <h2 class="sr-only">Features</h2>
            <Card
                src="./img/icon-chat.png"
                presentation="You are our #1 priority"
                details="Need to talk to a representative? You can get in
                        touch through our 24/7 chat or through a phone call
                        in less than 5 minutes."
            />
            <Card
                src="./img/icon-money.png"
                presentation="More savings means higher rates"
                details="The more you save with us, the higher your interest
                rate will be!"
            />
            <Card
                src="./img/icon-security.png"
                presentation="Security you can trust"
                details="We use top of the line encryption to make sure your
                data and money is always safe."
            />
        </div>
    )
}

export default Cards
