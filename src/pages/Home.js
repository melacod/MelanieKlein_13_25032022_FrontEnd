import Cards from '../components/Cards'
import Banner from '../layout/Banner'
import Footer from '../layout/Footer'
import Header from '../layout/Header'

/**
 * Home page
 * @component
 * @category Home
 */
const Home = () => {
    return (
        <>
            <Header />
            <main>
                <Banner />
                <Cards />
            </main>
            <Footer />
        </>
    )
}

export default Home
