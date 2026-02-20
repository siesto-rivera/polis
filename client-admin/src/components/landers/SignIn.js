// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import PropTypes from 'prop-types'
import { Navigate } from 'react-router'
import { Heading, Box, Button } from 'theme-ui'
import StaticLayout from './lander-layout'

import { useAuth } from 'react-oidc-context'
import strings from '../../strings/strings'

const SignIn = ({ authed }) => {
  const auth = useAuth()

  const handleSignIn = () => {
    auth.signinRedirect({
      state: { returnTo: window.location.pathname }
    }).catch((err) => {
      console.error('signinRedirect error:', err)
      alert('Sign in error: ' + (err.message || err))
    })
  }

  const drawLoginForm = () => {
    return (
      <Box>
        {auth.error && (
          <Box sx={{ color: 'red', my: [2], p: [2], bg: '#fee', borderRadius: 4 }}>
            Auth error: {auth.error.message}
          </Box>
        )}
        {auth.isLoading && (
          <Box sx={{ color: 'gray', my: [2] }}>Loading auth...</Box>
        )}
        <Button
          sx={{ my: [2] }}
          id="signinButton"
          onClick={handleSignIn}>
          {strings('auth_sign_in')}
        </Button>
      </Box>
    )
  }

  if (authed) {
    return <Navigate to={'/'} />
  }

  return (
    <StaticLayout>
      <Box>
        <Heading as="h1" sx={{ my: [4, null, 5], fontSize: [6, null, 7] }}>
          {strings('auth_sign_in')}
        </Heading>
        {drawLoginForm()}
      </Box>
    </StaticLayout>
  )
}

SignIn.propTypes = {
  authed: PropTypes.bool
}

export default SignIn
