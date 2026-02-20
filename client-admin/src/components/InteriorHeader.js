import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Logomark from './framework/Logomark'
import strings from '../strings/strings'
// import DonationBanner from './conversation-admin/DonationBanner'

const InteriorHeader = ({ children }) => {
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <div
        className="d-flex align-items-center justify-content-between w-100 py-2 py-xl-3 px-2 px-md-3 px-xl-4"
        style={{
          backgroundColor: '#03a9f4',
          color: '#fff',
          zIndex: 1000,
          minHeight: 0
        }}>
        <Link
          className="polis-header-link d-flex align-items-center flex-shrink-0"
          style={{ gap: '4px' }}
          to="/">
          <Logomark style={{ position: 'relative', top: 2 }} fill={'white'} />
          <span style={{ fontSize: '16px', whiteSpace: 'nowrap' }}>{strings('nav_polis')}</span>
        </Link>
        <Link
          id="signoutLink"
          className="polis-header-link flex-shrink-0"
          style={{ fontSize: '14px', whiteSpace: 'nowrap' }}
          to="/signout">
          {strings('nav_sign_out')}
        </Link>
      </div>
      {/* <DonationBanner /> */}
      <div style={{ width: '100%', overflowX: 'auto' }}>{children}</div>
    </div>
  )
}

InteriorHeader.propTypes = {
  children: PropTypes.node
}

export default InteriorHeader
