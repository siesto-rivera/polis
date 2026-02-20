// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Outlet, Link } from 'react-router'
import InteriorHeader from './InteriorHeader'
import strings from '../strings/strings'

const MainLayout = () => {
  return (
    <InteriorHeader>
      <div
        className="d-flex flex-column flex-xl-row w-100"
        style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
        {/* Navigation Sidebar - stacks vertically on mobile/tablet, sidebar on desktop */}
        <div
          className="d-flex flex-row flex-xl-column flex-wrap flex-xl-nowrap justify-content-center justify-content-xl-start py-2 py-xl-4 px-2 px-md-3 px-xl-4"
          style={{
            flex: '0 0 auto',
            gap: '8px',
            borderBottom: '2px solid #f6f7f8'
          }}>
          <div className="mb-0 mb-xl-3">
            <Link className="polis-nav-link" style={{ whiteSpace: 'nowrap' }} to={`/`}>
              {strings('nav_conversations')}
            </Link>
          </div>
          <div className="mb-0 mb-xl-3">
            <Link className="polis-nav-link" style={{ whiteSpace: 'nowrap' }} to={`/integrate`}>
              {strings('nav_integrate')}
            </Link>
          </div>
          <div className="mb-0 mb-xl-3">
            <Link className="polis-nav-link" style={{ whiteSpace: 'nowrap' }} to={`/account`}>
              {strings('nav_account')}
            </Link>
          </div>
        </div>
        {/* Main Content Area */}
        <div
          className="p-2 p-md-3 p-xl-4 mx-0 mx-xl-4"
          style={{
            flex: '1 1 auto',
            maxWidth: '65em',
            width: '100%',
            minWidth: 0,
            overflowX: 'auto',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
          <Outlet />
        </div>
      </div>
      <div className="text-center py-3" style={{ fontSize: '12px', color: '#9ca3af' }}>
        <a
          href="https://github.com/siesto-rivera/polis"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#9ca3af', textDecoration: 'none' }}>
          Source Code (AGPL-3.0)
        </a>
      </div>
    </InteriorHeader>
  )
}

export default MainLayout
