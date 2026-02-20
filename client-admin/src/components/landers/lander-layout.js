import PropTypes from 'prop-types'
import Header from './lander-header'
import Footer from './lander-footer'

const Layout = ({ children }) => {
  return (
    <div
      className="mx-auto w-100"
      style={{
        maxWidth: '45em',
        padding: '0 1rem 1rem'
      }}>
      <Header />
      <div>{children}</div>
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.element
}

export default Layout
