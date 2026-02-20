// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import Spinner from '../framework/Spinner'
import { useUser } from '../../util/auth'
import strings from '../../strings/strings'

const Account = () => {
  const userContext = useUser()

  const buildAccountMarkup = () => {
    return (
      <>
        <div>
          <h3 className="mb-3 mb-xl-4" style={{ fontSize: '20px', lineHeight: 1.5 }}>
            {strings('account_heading')}
          </h3>
          <p>{strings('account_greeting', { name: userContext?.user?.hname?.split(' ')[0] })}</p>
          <div>
            <p>{userContext?.user?.hname}</p>
            <p>{userContext?.user?.email}</p>
          </div>
        </div>
      </>
    )
  }

  return <div>{userContext?.user?.hname ? buildAccountMarkup() : <Spinner />}</div>
}

export default Account
