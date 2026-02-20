import { Link } from 'react-router'
import Logomark from '../framework/Logomark'

const Header = () => {
  return (
    <div>
      <div
        className="d-flex w-100 justify-content-between mx-auto"
        style={{ paddingTop: '2rem', paddingBottom: '1.45rem' }}>
        <div style={{ zIndex: 1000 }}>
          <Link className="polis-nav-link" to="/home2">
            <Logomark
              style={{ marginRight: 10, position: 'relative', top: 6 }}
              fill="#03a9f4"
            />
            Polis
          </Link>
        </div>
        <div>
          <Link className="polis-nav-link" to="/signin">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Header
