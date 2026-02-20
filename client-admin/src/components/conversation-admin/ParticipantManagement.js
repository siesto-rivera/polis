import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useConversationData } from '../../util/conversation_data'
import { handleConversationDataUpdate } from '../../actions'
import Pagination from './Pagination'
import XidsInUseTable from './ParticipantManagement/XidsInUseTable.js'
import XidAllowListTable from './ParticipantManagement/XidAllowListTable.js'
import PolisNet from '../../util/net'
import Spinner from '../framework/Spinner'
import strings from '../../strings/strings'

const ParticipantManagement = () => {
  const params = useParams()
  const conversationData = useConversationData()
  const dispatch = useDispatch()
  const conversationId = useMemo(
    () => conversationData?.conversation_id || params.conversation_id,
    [conversationData?.conversation_id, params.conversation_id]
  )

  const [xids, setXids] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [limit] = useState(50)

  const useXidAllowList = Boolean(conversationData?.use_xid_whitelist)
  const xidRequired = Boolean(conversationData?.xid_required)
  const [activeTab, setActiveTab] = useState('inUse') // 'inUse' | 'allowList'

  const handleXidAllowListToggle = () => {
    const newValue = !useXidAllowList
    dispatch(handleConversationDataUpdate(conversationData, 'use_xid_whitelist', newValue))
  }

  const handleXidRequiredToggle = () => {
    const newValue = !xidRequired
    dispatch(handleConversationDataUpdate(conversationData, 'xid_required', newValue))
  }

  const loadXids = async (newOffset = 0) => {
    if (!conversationId) return
    setLoading(true)
    setError(null)

    try {
      const res = await PolisNet.polisGet('/api/v3/xids', {
        conversation_id: conversationId,
        limit,
        offset: newOffset
      })

      setXids(res?.xids || [])
      setPagination(res?.pagination || null)
    } catch (e) {
      setError(e?.responseText || e?.message || 'Failed to load XIDs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (conversationId) {
      loadXids(0)
    }
  }, [conversationId])

  const handlePageChange = (newOffset) => {
    loadXids(newOffset)
  }

  return (
    <div>
      <h3 className="mb-3" style={{ lineHeight: 1.5 }}>
        {strings('participants_heading')}
      </h3>
      <span className="mb-3">{strings('participants_manage', { id: conversationId })}</span>

      <div className="d-flex align-items-start mb-2">
        <div style={{ flexShrink: 0, position: 'relative', top: -0.5 }}>
          <input
            type="checkbox"
            data-testid="xid_required"
            checked={xidRequired}
            onChange={handleXidRequiredToggle}
            disabled={useXidAllowList}
          />
        </div>
        <div
          className="ms-2"
          style={{
            flex: '1 1 auto',
            maxWidth: '35em',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
          <span>{strings('participants_xid_required')}</span>
          {useXidAllowList && (
            <span className="ms-2" style={{ color: '#999', fontSize: '0.75rem' }}>
              {strings('participants_xid_required_note')}
            </span>
          )}
        </div>
      </div>

      <div className="d-flex align-items-start mb-3">
        <div style={{ flexShrink: 0, position: 'relative', top: -0.5 }}>
          <input
            type="checkbox"
            data-testid="use_xid_whitelist"
            checked={useXidAllowList}
            onChange={handleXidAllowListToggle}
          />
        </div>
        <div
          className="ms-2"
          style={{
            flex: '1 1 auto',
            maxWidth: '35em',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
          <span>{strings('participants_use_allow_list')}</span>
        </div>
      </div>

      {/* Tab controls */}
      <div className="d-flex mb-3 flex-wrap" style={{ gap: '0.5rem' }}>
        <Button
          variant={activeTab === 'inUse' ? 'primary' : 'outline-secondary'}
          size="sm"
          onClick={() => setActiveTab('inUse')}>
          {strings('participants_tab_in_use')}
        </Button>
        <Button
          variant={activeTab === 'allowList' ? 'primary' : 'outline-secondary'}
          size="sm"
          onClick={() => setActiveTab('allowList')}>
          {strings('participants_tab_allowed')}
        </Button>
      </div>

      {activeTab === 'inUse' && loading && !xids.length ? (
        <Spinner />
      ) : activeTab === 'inUse' && error ? (
        <span className="mb-3" style={{ color: 'var(--bs-danger)' }}>{error}</span>
      ) : activeTab === 'inUse' && xids.length === 0 ? (
        <span className="mb-3" style={{ color: '#999' }}>{strings('participants_no_xids')}</span>
      ) : activeTab === 'inUse' ? (
        <>
          <XidsInUseTable xids={xids} conversationId={conversationId} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} loading={loading} />
        </>
      ) : (
        <XidAllowListTable conversationId={conversationId} />
      )}
    </div>
  )
}

export default ParticipantManagement
