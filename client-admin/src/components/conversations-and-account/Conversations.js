// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { handleCreateConversationSubmit, populateConversationsStore } from '../../actions'
import PolisNet, { isAuthReady } from '../../util/net'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'

import Url from '../../util/url'
import { useAuth } from 'react-oidc-context'
import Conversation from './Conversation'
import { useLocation, useNavigate } from 'react-router'
import { isSuperAdmin } from '../../util/auth'
import Pagination from '../conversation-admin/Pagination'
import strings from '../../strings/strings'
import { getLocale } from '../../strings/strings'

const Conversations = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth()
  const { conversations, loading, error } = useSelector((state) => state.conversations)

  const userState = useSelector((state) => state.user)
  const superAdmin = isSuperAdmin(userState)

  const [interstitialVisible, setInterstitialVisible] = useState(false)
  const [activeView, setActiveView] = useState('my')
  const [allConversations, setAllConversations] = useState(null)
  const [allLoading, setAllLoading] = useState(false)
  const [allError, setAllError] = useState(null)
  const [allPagination, setAllPagination] = useState(null)

  const [filters, setFilters] = useState({
    owner_email: '',
    is_active: '',
    recently_updated_days: '',
    recently_created_days: '',
    min_comment_count: '',
    min_participant_count: ''
  })
  const [sort, setSort] = useState({ sort_by: 'updated', sort_dir: 'desc' })

  const [filterState] = useState({
    filterMinParticipantCount: 0,
    sort: 'participant_count'
  })

  const loadConversationsIfNeeded = useCallback(() => {
    const authSystemReady = isAuthReady()

    if (!isLoading && isAuthenticated && authSystemReady) {
      if (activeView === 'my') {
        if (!loading && !conversations) {
          dispatch(populateConversationsStore())
        }
      } else if (activeView === 'all' && superAdmin) {
        if (!allLoading && !allConversations) {
          setAllLoading(true)
          setAllError(null)
          const qs = new URLSearchParams()
          if (filters.owner_email) qs.set('owner_email', filters.owner_email)
          if (filters.is_active !== '') qs.set('is_active', String(filters.is_active))
          if (filters.recently_updated_days)
            qs.set('recently_updated_days', String(filters.recently_updated_days))
          if (filters.recently_created_days)
            qs.set('recently_created_days', String(filters.recently_created_days))
          if (filters.min_comment_count)
            qs.set('min_comment_count', String(filters.min_comment_count))
          if (filters.min_participant_count)
            qs.set('min_participant_count', String(filters.min_participant_count))
          if (sort.sort_by) qs.set('sort_by', sort.sort_by)
          if (sort.sort_dir) qs.set('sort_dir', sort.sort_dir)
          if (allPagination?.limit) qs.set('limit', String(allPagination.limit))
          if (allPagination?.offset !== undefined) qs.set('offset', String(allPagination.offset))

          PolisNet.getAccessTokenSilentlySPA()
            .then((token) =>
              fetch(`/api/v3/all_conversations?${qs.toString()}`, {
                method: 'GET',
                headers: {
                  ...(token && { Authorization: `Bearer ${token}` })
                }
              })
            )
            .then((r) => r.json())
            .then((json) => {
              setAllConversations(json?.conversations || [])
              setAllPagination(json?.pagination || null)
            })
            .catch((e) => setAllError(e))
            .finally(() => setAllLoading(false))
        }
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    loading,
    conversations,
    activeView,
    superAdmin,
    allLoading,
    allConversations,
    dispatch
  ])

  useEffect(() => {
    const handleAuthReady = () => {
      loadConversationsIfNeeded()
    }

    window.addEventListener('polisAuthReady', handleAuthReady)

    if (isAuthenticated && !isLoading) {
      loadConversationsIfNeeded()

      return () => {
        window.removeEventListener('polisAuthReady', handleAuthReady)
      }
    }

    return () => {
      window.removeEventListener('polisAuthReady', handleAuthReady)
    }
  }, [loadConversationsIfNeeded, isAuthenticated, isLoading])

  const onNewClicked = (isActive = true) => {
    dispatch(handleCreateConversationSubmit(navigate, isActive))
  }

  const goToConversation = (conversation_id) => {
    return () => {
      if (location.pathname === 'other-conversations') {
        window.open(`${Url.urlPrefix}${conversation_id}`, '_blank')
        return
      }
      navigate(`/m/${conversation_id}`)
    }
  }

  const filterCheck = (c) => {
    let include = true

    if (c.participant_count < filterState.filterMinParticipantCount) {
      include = false
    }

    if (location.pathname === 'other-conversations') {
      include = !c.is_owner
    }

    if (location.pathname !== 'other-conversations' && !c.is_owner) {
      include = false
    }

    return include
  }

  const err = activeView === 'all' ? allError : error

  const renderSwitcher = () => {
    if (!superAdmin) return null
    return (
      <div className="mb-3 mb-xl-4">
        <span
          onClick={() => setActiveView('my')}
          className="me-3"
          style={{
            cursor: 'pointer',
            fontWeight: activeView === 'my' ? 'bold' : 'normal',
            textDecoration: activeView === 'my' ? 'underline' : 'none'
          }}>
          {strings('convos_my')}
        </span>
        <span
          onClick={() => setActiveView('all')}
          style={{
            cursor: 'pointer',
            fontWeight: activeView === 'all' ? 'bold' : 'normal',
            textDecoration: activeView === 'all' ? 'underline' : 'none'
          }}>
          {strings('convos_all')}
        </span>
      </div>
    )
  }

  const renderAllControls = () => {
    if (!(activeView === 'all' && superAdmin)) return null
    return (
      <div className="mb-3">
        <div className="d-flex flex-wrap align-items-center" style={{ gap: '12px' }}>
          <input
            type="text"
            placeholder={strings('convos_owner_email_placeholder')}
            value={filters.owner_email}
            onChange={(e) => setFilters((f) => ({ ...f, owner_email: e.target.value }))}
          />
          <select
            value={filters.is_active}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                is_active: e.target.value === '' ? '' : e.target.value === 'true'
              }))
            }>
            <option value="">{strings('convos_all_statuses')}</option>
            <option value="true">{strings('convos_active')}</option>
            <option value="false">{strings('convos_inactive')}</option>
          </select>
          <input
            type="number"
            min="0"
            placeholder={strings('convos_min_comments')}
            value={filters.min_comment_count}
            onChange={(e) => setFilters((f) => ({ ...f, min_comment_count: e.target.value }))}
            style={{ width: 120 }}
          />
          <input
            type="number"
            min="0"
            placeholder={strings('convos_min_participants')}
            value={filters.min_participant_count}
            onChange={(e) => setFilters((f) => ({ ...f, min_participant_count: e.target.value }))}
            style={{ width: 140 }}
          />
          <input
            type="number"
            min="0"
            placeholder={strings('convos_updated_days')}
            value={filters.recently_updated_days}
            onChange={(e) => setFilters((f) => ({ ...f, recently_updated_days: e.target.value }))}
            style={{ width: 200 }}
          />
          <input
            type="number"
            min="0"
            placeholder={strings('convos_created_days')}
            value={filters.recently_created_days}
            onChange={(e) => setFilters((f) => ({ ...f, recently_created_days: e.target.value }))}
            style={{ width: 200 }}
          />
          <select
            value={sort.sort_by}
            onChange={(e) => setSort((s) => ({ ...s, sort_by: e.target.value }))}>
            <option value="updated">{strings('convos_sort_updated')}</option>
            <option value="created">{strings('convos_sort_created')}</option>
            <option value="participant_count">{strings('convos_sort_participants')}</option>
            <option value="comment_count">{strings('convos_sort_comments')}</option>
          </select>
          <select
            value={sort.sort_dir}
            onChange={(e) => setSort((s) => ({ ...s, sort_dir: e.target.value }))}>
            <option value="desc">{strings('convos_desc')}</option>
            <option value="asc">{strings('convos_asc')}</option>
          </select>
          <Button
            onClick={() => {
              setAllConversations(null)
              loadConversationsIfNeeded()
            }}>
            {strings('convos_apply')}
          </Button>
        </div>
        {allPagination ? (
          <Pagination
            pagination={allPagination}
            loading={allLoading}
            onPageChange={(newOffset, newLimit) => {
              setAllPagination((p) => ({ ...(p || {}), offset: newOffset, limit: newLimit }))
              setAllConversations(null)
              loadConversationsIfNeeded()
            }}
          />
        ) : null}
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-3 mb-xl-4" style={{ fontSize: '20px', lineHeight: 1.5 }}>
        {strings('convos_heading')}
      </h3>
      {interstitialVisible && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}>
          <div
            className="p-4 position-relative"
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(0,0,0,0.3)',
              width: '90%',
              maxWidth: '1200px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
            <CloseButton
              onClick={() => {
                onNewClicked()
                setInterstitialVisible(false)
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px'
              }}
            />
            <h2 className="mb-3" style={{ fontSize: '32px', color: '#03a9f4' }}>
              {strings('convos_interstitial_heading')}
            </h2>
            <span className="mb-4 mt-4 d-block" style={{ fontSize: '16px' }}>
              {strings('convos_interstitial_desc')}
            </span>

            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6">
                <h4 className="mb-2">
                  {strings('convos_interstitial_analysis')}
                </h4>
                <img src="/bg_map.png" className="w-100 mb-2" style={{ borderRadius: '4px' }} alt="" />
                <span>
                  {strings('convos_interstitial_analysis_desc')}
                </span>
              </div>
              <div className="col-12 col-md-6">
                <h4 className="mb-2">
                  {strings('convos_interstitial_reports')}
                </h4>
                <img src="/bg_collective.png" className="w-100 mb-2" style={{ borderRadius: '4px' }} alt="" />
                <span>
                  {strings('convos_interstitial_reports_desc')}
                </span>
              </div>
            </div>

            <div className="p-3 mb-4" style={{ backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
              <h4 className="mb-2">
                {strings('convos_interstitial_features')}
              </h4>
              <ul className="ps-3 m-0">
                <li>{strings('convos_interstitial_feature_1')}</li>
                <li>{strings('convos_interstitial_feature_2')}</li>
                <li>{strings('convos_interstitial_feature_3')}</li>
                <li>{strings('convos_interstitial_feature_4')}</li>
              </ul>
            </div>

            <p className="mb-4 text-center" style={{ fontSize: '16px' }}>
              {strings('convos_interstitial_ready')}
              <br />
              <a
                href="https://pro.pol.is/"
                target="_blank"
                rel="noopener noreferrer"
                className="fw-bold">
                {strings('convos_interstitial_upgrade')}
              </a>
            </p>

            <div className="d-flex justify-content-end align-items-center" style={{ gap: '12px' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  onNewClicked()
                  setInterstitialVisible(false)
                }}>
                {strings('convos_interstitial_later')}
              </Button>
              <Button
                onClick={() => {
                  onNewClicked()
                  setInterstitialVisible(false)
                }}>
                {strings('convos_interstitial_create')}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="mb-3 mb-xl-4">
        <Button onClick={() => setInterstitialVisible(true)}>{strings('convos_create_new')}</Button>
      </div>
      {renderSwitcher()}
      {renderAllControls()}
      <div>
        <div className="mb-3">
          {activeView === 'all'
            ? allLoading
              ? strings('convos_loading')
              : null
            : loading
              ? strings('convos_loading')
              : null}
        </div>
        {err ? <span>{strings('convos_error')}</span> : null}
        {activeView === 'all' && superAdmin ? (
          <div>
            {/* Headers for desktop table view */}
            <div
              className="d-none d-md-grid p-2 fw-bold"
              style={{
                gridTemplateColumns: '3fr 1fr 1fr 1.5fr 1.5fr 2fr 1fr',
                gap: '12px',
                borderBottom: '2px solid #9ca3af'
              }}>
              <span>{strings('convos_col_topic')}</span>
              <span className="text-end">{strings('convos_col_participants')}</span>
              <span className="text-end">{strings('convos_col_comments')}</span>
              <span className="text-end">{strings('convos_col_updated')}</span>
              <span className="text-end">{strings('convos_col_created')}</span>
              <span>{strings('convos_col_owner_email')}</span>
              <span className="text-center">{strings('convos_col_active')}</span>
            </div>
            {(allConversations || []).map((c) => (
              <div
                key={c.conversation_id}
                onClick={goToConversation(c.conversation_id)}
                className="p-3 p-md-2 mb-3 mb-md-0"
                style={{
                  cursor: 'pointer',
                  border: '1px solid #9ca3af',
                  borderRadius: 4
                }}>
                <div className="d-block d-md-grid" style={{ gridTemplateColumns: '3fr 1fr 1fr 1.5fr 1.5fr 2fr 1fr', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <span className="fw-bold d-inline d-md-none">{strings('convos_label_topic')} </span>
                    {c.topic}
                  </div>
                  <div className="text-md-end">
                    <span className="fw-bold d-inline d-md-none">{strings('convos_label_participants')} </span>
                    {c.participant_count || 0}
                  </div>
                  <div className="text-md-end">
                    <span className="fw-bold d-inline d-md-none">{strings('convos_label_comments')} </span>
                    {c.comment_count || 0}
                  </div>
                  <div className="text-md-end">
                    <span className="fw-bold d-inline d-md-none">{strings('convos_label_updated')} </span>
                    {new Date(c.modified).toLocaleDateString(getLocale(), {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-md-end">
                    <span className="fw-bold d-inline d-md-none">{strings('convos_label_created')} </span>
                    {new Date(c.created).toLocaleDateString(getLocale(), {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div>
                    <span className="fw-bold d-inline d-md-none">{strings('convos_label_owner')} </span>
                    {c.owner_email || ''}
                  </div>
                  <div className="text-center">
                    <span className="fw-bold d-inline d-md-none">{strings('convos_label_active')} </span>
                    {c.is_active ? '✅' : '❌'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : conversations ? (
          conversations.map((c, i) => {
            return filterCheck(c) ? (
              <Conversation
                key={c.conversation_id}
                c={c}
                i={i}
                goToConversation={goToConversation(c.conversation_id)}
              />
            ) : null
          })
        ) : null}
      </div>
    </div>
  )
}

export default Conversations
