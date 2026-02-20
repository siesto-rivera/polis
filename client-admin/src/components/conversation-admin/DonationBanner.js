// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { useState } from 'react'
import CloseButton from 'react-bootstrap/CloseButton'

const DonationBanner = () => {
  const [visible, setVisible] = useState(true)

  if (!visible) {
    return null
  }

  return (
    <div
      className="p-3 mb-4 position-relative"
      style={{
        backgroundColor: 'lightyellow',
        border: '1px solid orange',
        borderRadius: '4px',
        paddingRight: '20px'
      }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <CloseButton
          onClick={() => setVisible(false)}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px'
          }}
        />
        <span className="fw-bold mb-2 d-block" style={{ fontSize: '16px' }}>
          Pol.is is more than a platform; it&apos;s a new public square.
        </span>
        <span className="mb-2" style={{ fontSize: '14px' }}>
          From local communities to national debates, Pol.is helps bridge divides and build
          consensus. It&apos;s a quiet revolution in public discourse. To protect this vital space
          for democracy and expand its impact, we rely on support from users like you.
        </span>
        <br />
        <a
          href="https://pol.is/donate"
          target="_blank"
          rel="noopener noreferrer"
          className="fw-bold d-inline-block"
          style={{ fontSize: '16px' }}>
          Please consider a donation to secure the future of Pol.is.
        </a>
      </div>
    </div>
  )
}

export default DonationBanner
