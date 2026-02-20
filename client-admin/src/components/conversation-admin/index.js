// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Routes, Route, Link, useParams, useLocation } from 'react-router'
import { useAuth } from 'react-oidc-context'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { checkConvoPermissions, useUser, hasDelphiEnabled } from '../../util/auth'
import { populateConversationDataStore, resetMetadataStore } from '../../actions'
import { ConversationDataProvider, useConversationData } from '../../util/conversation_data'
import ConversationConfig from './ConversationConfig'
import BYODConfig from './BYODConfig'
import ConversationStats from './stats'
import InviteCodes from './InviteCodes'
import InviteTree from './InviteTree'
import ModerateComments from './comment-moderation/'
import NoPermission from './NoPermission'
import ParticipantManagement from './ParticipantManagement'
import Reports from './report/Reports'
import ShareAndEmbed from './ShareAndEmbed'
import Spinner from '../framework/Spinner'
import strings from '../../strings/strings'
import TopicModeration from './topic-moderation/'

const ConversationAdmin = () => {
  const params = useParams()
  const location = useLocation()
  const conversationData = useConversationData()
  const userContext = useUser()
  const { user: authUser } = useAuth()

  const [permissionState, setPermissionState] = useState('CHECKING') // CHECKING, PERMITTED, DENIED

  useEffect(() => {
    if (conversationData.loading || !conversationData || !userContext.user) {
      return
    }

    if (permissionState === 'CHECKING') {
      const hasPermission = checkConvoPermissions(userContext, conversationData)
      setPermissionState(hasPermission ? 'PERMITTED' : 'DENIED')
    }
  }, [userContext, conversationData, permissionState])

  useEffect(() => {
    setPermissionState('CHECKING')
  }, [params.conversation_id])

  const url = location.pathname.split('/')[3]
  const baseUrl = `/m/${params.conversation_id}`

  const navLinkClass = (linkUrl) => {
    if (linkUrl === undefined) {
      return url ? 'polis-nav-link' : 'polis-nav-link-active'
    }
    return url === linkUrl ? 'polis-nav-link-active' : 'polis-nav-link'
  }

  const renderContent = () => {
    switch (permissionState) {
      case 'CHECKING':
        return <Spinner />
      case 'DENIED':
        return <NoPermission />
      case 'PERMITTED':
        return (
          <Routes>
            <Route path="/" element={<ConversationConfig />} />
            <Route path="share" element={<ShareAndEmbed />} />
            <Route path="reports/*" element={<Reports />} />
            <Route path="comments/*" element={<ModerateComments />} />
            <Route path="stats" element={<ConversationStats />} />
            <Route path="import" element={<BYODConfig />} />
            <Route
              path="topics/*"
              element={
                <TopicModeration
                  conversation_id={params.conversation_id}
                  baseUrl={`${baseUrl}/topics`}
                  location={location}
                />
              }
            />
            <Route path="invite-tree" element={<InviteTree />} />
            <Route path="invite-codes" element={<InviteCodes />} />
            {hasDelphiEnabled(authUser) && (
              <Route path="participants" element={<ParticipantManagement />} />
            )}
          </Routes>
        )
      default:
        return null
    }
  }

  return (
    <div
      className="d-flex flex-column flex-xl-row w-100"
      style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Conversation Navigation */}
      <div
        className="d-flex flex-row flex-xl-column flex-wrap flex-xl-nowrap justify-content-start py-2 py-xl-4 px-2 px-md-3 px-xl-4"
        style={{
          flex: '0 0 auto',
          columnGap: '8px',
          rowGap: '8px',
          borderBottom: '2px solid #f6f7f8',
          overflowX: 'auto',
          minWidth: 0
        }}>
        <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
          <Link className="polis-nav-link" to={`/`}>
            {strings('nav_all')}
          </Link>
        </div>
        <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
          <Link className={navLinkClass(undefined)} to={baseUrl}>
            {strings('nav_configure')}
          </Link>
        </div>
        <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
          <Link className={navLinkClass('share')} to={`${baseUrl}/share`}>
            {strings('nav_distribute')}
          </Link>
        </div>
        <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
          <Link
            className={navLinkClass('comments')}
            data-testid="moderate-comments"
            to={`${baseUrl}/comments`}>
            {strings('nav_moderate')}
          </Link>
        </div>
        <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
          <Link className={navLinkClass('stats')} to={`${baseUrl}/stats`}>
            {strings('nav_monitor')}
          </Link>
        </div>
        <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
          <Link className={navLinkClass('reports')} to={`${baseUrl}/reports`}>
            {strings('nav_reports')}
          </Link>
        </div>
        <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
          <Link className={navLinkClass('invite-tree')} to={`${baseUrl}/invite-tree`}>
            {strings('nav_invite_tree')}
          </Link>
        </div>
        {conversationData?.treevite_enabled && (
          <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
            <Link className={navLinkClass('invite-codes')} to={`${baseUrl}/invite-codes`}>
              {strings('nav_invite_codes')}
            </Link>
          </div>
        )}
        {hasDelphiEnabled(authUser) && (
          <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
            <Link className={navLinkClass('participants')} to={`${baseUrl}/participants`}>
              {strings('nav_participants')}
            </Link>
          </div>
        )}
        {hasDelphiEnabled(authUser) && (
          <div className="mb-0 mb-xl-3" style={{ whiteSpace: 'nowrap' }}>
            <Link className={navLinkClass('import')} to={`${baseUrl}/import`}>
              {strings('nav_import')}
            </Link>
          </div>
        )}
      </div>
      {/* Content Area */}
      <div
        className="p-2 p-md-3 p-xl-4 mx-0 mx-xl-4"
        style={{
          flex: '1 1 auto',
          maxWidth: '60em',
          width: '100%',
          minWidth: 0,
          overflowX: 'auto',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}>
        {renderContent()}
      </div>
    </div>
  )
}

const ConversationAdminContainer = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const { isAuthenticated } = useAuth()
  const conversationData = useSelector((state) => state.conversationData)

  const loadConversationData = () => {
    dispatch(populateConversationDataStore(params.conversation_id))
  }

  const resetMetadata = () => {
    dispatch(resetMetadataStore())
  }

  useEffect(() => {
    if (!conversationData.loading && isAuthenticated) {
      loadConversationData()
    }
  }, [isAuthenticated])

  useEffect(() => {
    return () => {
      resetMetadata()
    }
  }, [])

  useEffect(() => {
    if (params.conversation_id) {
      loadConversationData()
    }
  }, [params.conversation_id])

  return (
    <ConversationDataProvider>
      <ConversationAdmin />
    </ConversationDataProvider>
  )
}

export default ConversationAdminContainer
