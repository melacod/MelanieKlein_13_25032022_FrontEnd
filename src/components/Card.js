const Card = ({ src, presentation, details }) => {
    return (
        <>
            <div class="feature-item">
                <img src={src} alt="Chat Icon" class="feature-icon" />
                <h3 class="feature-item-title">{presentation}</h3>
                <p>{details}</p>
            </div>
        </>
    )
}

export default Card
