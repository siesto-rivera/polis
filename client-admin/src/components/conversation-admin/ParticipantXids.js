// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useAuth } from 'react-oidc-context'
import PolisNet from '../../util/net'
import Url from '../../util/url'

const { urlPrefix } = Url

const getCurrentTimestamp = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`
}

const getDownloadFilename = (conversation_id) => {
  return `${getCurrentTimestamp()}-${conversation_id}-xid.csv`
}

const ParticipantXids = ({ conversation_id }) => {
  const { isLoading, isAuthenticated } = useAuth()

  const [state, setState] = useState({
    conversationUuid: null,
    isLoading: true,
    error: null
  })

  const loadConversationUuid = () => {
    // Use PolisNet.polisGet to ensure proper authorization header
    PolisNet.polisGet('/api/v3/conversationUuid', {
      conversation_id: conversation_id
    })
      .then((data) => {
        setState({
          conversationUuid: data.conversation_uuid,
          isLoading: false,
          error: null
        })
      })
      .catch((error) => {
        console.error('Error fetching UUID:', error)
        setState({
          conversationUuid: null,
          error: 'Failed to fetch conversation UUID',
          isLoading: false
        })
      })
  }

  const loadConversationUuidIfNeeded = () => {
    // Only load if we have a conversation ID and Auth is ready (not loading)
    if (conversation_id && !isLoading && !state.conversationUuid) {
      loadConversationUuid()
    }
  }

  useEffect(() => {
    // Try to load conversation UUID when component mounts
    loadConversationUuidIfNeeded()
  }, [])

  useEffect(() => {
    // Try again if conversation_id changes or auth state changes
    loadConversationUuidIfNeeded()
  }, [conversation_id, isLoading, isAuthenticated])

  const { conversationUuid, isLoading: uuidLoading, error } = state

  // Only calculate these values if we have a UUID
  const downloadFilename = getDownloadFilename(conversation_id)

  return (
    <div>
      <h3
        className="d-block mb-3"
        style={{ lineHeight: 1.5 }}>
        DOWNLOAD XID CSV
      </h3>

      {uuidLoading ? (
        // Show loading indicator while fetching UUID
        <span className="d-block mb-3">
          Loading conversation UUID for XID download...
        </span>
      ) : error ? (
        // Show error message if failed to fetch UUID
        <span
          className="d-block mb-3"
          style={{ color: 'var(--bs-danger)' }}>
          Could not load conversation UUID for XID download
        </span>
      ) : conversationUuid ? (
        // Only show download links if we have the UUID
        <>
          <span className="d-block mb-2">
            <a
              download={downloadFilename}
              href={`${urlPrefix}api/v3/xid/${conversationUuid}-xid.csv`}
              type="text/csv">
              xid csv download: {downloadFilename}
            </a>
          </span>

          <span className="d-block mb-3">
            {`curl: ${urlPrefix}api/v3/xid/${conversationUuid}-xid.csv`}
          </span>
        </>
      ) : (
        // Fallback message when UUID is null but no error occurred
        <span className="d-block mb-3">
          No conversation UUID available for XID download
        </span>
      )}

      <h3
        className="d-block mb-3 mt-4"
        style={{ lineHeight: 1.5 }}>
        WHAT IS AN XID? GET UP AND RUNNING WITH PARTICIPANT IDENTITY!
      </h3>

      <ul>
        <li>
          Sometimes, the{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/owner">
            owner
          </a>{' '}
          of a{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/conversation">
            conversation
          </a>{' '}
          has some existing linkage to the identity of their{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/participant">
            participants
          </a>
          , i.e., they are sending out an email campaign or people are participating behind a login
          wall where the conversation is embedded
        </li>

        <li>
          A note: using{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/xid">
            xid
          </a>{' '}
          assumes that the{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/owners">
            owner
          </a>{' '}
          has the token, this is different from{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/creating-single-use-urls">
            creating single use urls
          </a>
        </li>

        <li>
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/xid">
            xid
          </a>{' '}
          works in the embedded case — i.e., the{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/owners">
            owner
          </a>{' '}
          has added the{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/embed-code">
            embed code
          </a>{' '}
          to a page on their own web property
        </li>

        <li>
          Once the{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/conversation">
            conversation
          </a>{' '}
          has been embedded on a third party webpage, that page can, however it likes, via
          JavaScript or via templating for instance, add the data attribute{' '}
          <code>data-xid=&quot;test&quot;</code>
        </li>

        <li>
          The{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/xid">
            xid
          </a>{' '}
          value for each participant will be available on the participation record in the{' '}
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/export">
            export
          </a>
        </li>

        <li>
          <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/xid">
            Example
          </a>
          <ul>
            <li>
              A common workflow for using{' '}
              <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/xid">
                xid
              </a>{' '}
              involves a table of demographic data available from a polling provider
            </li>

            <li>
              <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/participant">
                Participants
              </a>{' '}
              are sent an email and invited to participate
            </li>

            <li>
              Then, when the{' '}
              <a target="_blank" rel="noreferrer" href="https://compdemocracy.org/participant">
                participant
              </a>{' '}
              clicks through the email to a custom url, custom JavaScript written by whoever is
              controlling the third party website on which polis is embedded grabs a token out of
              the url and adds it to the
              <span style={{ display: 'inline-block' }}>
                <code>data-xid=&quot;someTokenFromTheURLBarThatIdentifiesTheUser&quot;</code>
              </span>
            </li>
          </ul>
        </li>

        <li>Embed code parameter that allows login-less participation by known users</li>

        <li>
          Usage: <code>data-xid=&quot;guid&quot;</code>, or{' '}
          <code>data-xid=&quot;5647434556754623&quot;</code>, or less anonymously and not
          recommended <code>data-xid=&quot;foo@bar.com&quot;</code>
        </li>
      </ul>
    </div>
  )
}

ParticipantXids.propTypes = {
  conversation_id: PropTypes.string.isRequired
}

export default ParticipantXids
