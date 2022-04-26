/**
 * Home card
 * @component
 * @category Home
 */
const Card = ({ src, presentation, details }) => {
    return (
        <>
            <div className="feature-item">
                <img src={src} alt="Chat Icon" className="feature-icon" />
                <h3 className="feature-item-title">{presentation}</h3>
                <p>{details}</p>
            </div>
        </>
    )
}

export default Card
