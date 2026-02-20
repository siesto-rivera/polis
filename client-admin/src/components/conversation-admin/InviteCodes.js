import Button from 'react-bootstrap/Button'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'

import { useConversationData } from '../../util/conversation_data'
import Pagination from './Pagination'
import PolisNet from '../../util/net'
import Spinner from '../framework/Spinner'
import strings from '../../strings/strings'

const InviteCodes = () => {
  const params = useParams()
  const conversationData = useConversationData()
  const enabled = Boolean(conversationData?.treevite_enabled)
  const conversationId = useMemo(
    () => conversationData?.conversation_id || params.conversation_id,
    [conversationData?.conversation_id, params.conversation_id]
  )

  const [invites, setInvites] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [downloadLoading, setDownloadLoading] = useState(false)

  // Filtering and pagination state
  const [waveFilter, setWaveFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [limit] = useState(50)
  const [offset, setOffset] = useState(0)

  // Available waves for filter dropdown
  const [availableWaves, setAvailableWaves] = useState([])

  const loadInvites = async (newOffset = offset, resetOffset = false) => {
    if (!conversationId) return
    setLoading(true)
    setError(null)

    const actualOffset = resetOffset ? 0 : newOffset

    try {
      const params = {
        conversation_id: conversationId,
        limit,
        offset: actualOffset
      }

      if (waveFilter) params.wave_id = parseInt(waveFilter)
      if (statusFilter !== '') params.status = parseInt(statusFilter)

      const res = await PolisNet.polisGet('/api/v3/treevite/invites', params)

      setInvites(res?.invites || [])
      setPagination(res?.pagination || null)
      if (resetOffset) setOffset(0)
      else setOffset(actualOffset)
    } catch (e) {
      setError(e?.responseText || e?.message || 'Failed to load invite codes')
    } finally {
      setLoading(false)
    }
  }

  const loadWaves = async () => {
    if (!conversationId) return
    try {
      const res = await PolisNet.polisGet('/api/v3/treevite/waves', {
        conversation_id: conversationId
      })
      setAvailableWaves(Array.isArray(res) ? res : [])
    } catch {
      // Silently fail - waves are just for filtering
    }
  }

  useEffect(() => {
    if (enabled) {
      loadWaves()
      loadInvites(0, true)
    }
  }, [enabled, conversationId])

  useEffect(() => {
    if (enabled) {
      loadInvites(0, true)
    }
  }, [waveFilter, statusFilter])

  const handlePageChange = (newOffset) => {
    loadInvites(newOffset)
  }

  const handleClearFilters = () => {
    setWaveFilter('')
    setStatusFilter('')
  }

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return strings('invite_status_unused')
      case 1:
        return strings('invite_status_used')
      case 2:
        return strings('invite_status_revoked')
      case 3:
        return strings('invite_status_expired')
      default:
        return strings('invite_status_n', { status })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return 'var(--bs-success)'
      case 1:
        return 'var(--bs-info)'
      case 2:
        return 'var(--bs-danger)'
      case 3:
        return 'var(--bs-warning)'
      default:
        return 'gray'
    }
  }

  const handleDownloadCsv = async () => {
    if (!conversationId) return
    try {
      setDownloadLoading(true)
      const token = await PolisNet.getAccessTokenSilentlySPA()

      const url = `/api/v3/treevite/invites/csv?conversation_id=${encodeURIComponent(
        conversationId
      )}`

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `Failed to download CSV (status ${res.status})`)
      }

      const blob = await res.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      const ts = new Date().toISOString().replace(/[:.]/g, '-')
      a.href = blobUrl
      a.download = `treevite_invites_${conversationId}_${ts}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      // Keep errors local to the action to avoid hiding the table
      alert(e?.message || 'Failed to download CSV')
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    <div>
      <h3 className="mb-3" style={{ lineHeight: 1.5 }}>
        {strings('invite_codes_heading')}
      </h3>

      {!enabled ? (
        <span>
          {strings('invite_tree_not_enabled')}
        </span>
      ) : (
        <>
          <div
            className="d-flex mb-3 flex-wrap align-items-center justify-content-between"
            style={{ gap: '0.5rem' }}>
            <span className="d-block mb-2">
              {strings('invite_codes_desc')}
            </span>
            <Button
              variant="outline-secondary"
              onClick={handleDownloadCsv}
              disabled={!conversationId || downloadLoading}
              size="sm">
              {downloadLoading ? strings('invite_preparing') : strings('invite_download_csv')}
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-3 p-3 rounded" style={{ backgroundColor: '#f0f0f0' }}>
            <span style={{ fontWeight: 'bold' }} className="mb-2">{strings('invite_filters')}</span>
            <div className="d-flex flex-wrap align-items-end" style={{ gap: '1rem' }}>
              <div>
                <span className="d-block mb-1" style={{ fontSize: '0.875rem' }}>{strings('invite_filter_wave')}</span>
                <select
                  className="form-select"
                  value={waveFilter}
                  onChange={(e) => setWaveFilter(e.target.value)}
                  style={{ minWidth: '120px' }}>
                  <option value="">{strings('invite_all_waves')}</option>
                  {availableWaves.map((wave) => (
                    <option key={wave.id} value={wave.id}>
                      {strings('invite_wave_n', { wave: wave.wave })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="d-block mb-1" style={{ fontSize: '0.875rem' }}>{strings('invite_filter_status')}</span>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ minWidth: '140px' }}>
                  <option value="">{strings('invite_all_statuses')}</option>
                  <option value="0">{strings('invite_status_unused')}</option>
                  <option value="1">{strings('invite_status_used')}</option>
                  <option value="2">{strings('invite_status_revoked')}</option>
                  <option value="3">{strings('invite_status_expired')}</option>
                </select>
              </div>

              {(waveFilter || statusFilter !== '') && (
                <Button variant="outline-secondary" onClick={handleClearFilters} size="sm">
                  {strings('invite_clear_filters')}
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <Spinner />
          ) : error ? (
            <span style={{ color: 'var(--bs-danger)' }}>{String(error)}</span>
          ) : invites.length > 0 ? (
            <div>
              <span className="mb-2" style={{ fontWeight: 'bold' }}>
                {strings('invite_found_codes', { count: pagination?.total || invites.length })}
              </span>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        borderBottom: '1px solid #ccc',
                        paddingBottom: '0.5rem',
                        paddingRight: '1rem'
                      }}>
                      {strings('invite_col_code')}
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        borderBottom: '1px solid #ccc',
                        paddingBottom: '0.5rem',
                        paddingRight: '1rem'
                      }}>
                      {strings('invite_col_wave')}
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        borderBottom: '1px solid #ccc',
                        paddingBottom: '0.5rem',
                        paddingRight: '1rem'
                      }}>
                      {strings('invite_col_status')}
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        borderBottom: '1px solid #ccc',
                        paddingBottom: '0.5rem'
                      }}>
                      {strings('invite_col_used_at')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td
                        style={{
                          borderBottom: '1px solid #eee',
                          padding: '0.5rem 1rem 0.5rem 0',
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }}>
                        {invite.invite_code}
                      </td>
                      <td
                        style={{
                          borderBottom: '1px solid #eee',
                          padding: '0.5rem 1rem 0.5rem 0'
                        }}>
                        {invite.wave || strings('invite_na')}
                      </td>
                      <td
                        style={{
                          borderBottom: '1px solid #eee',
                          padding: '0.5rem 1rem 0.5rem 0',
                          color: getStatusColor(invite.status),
                          fontWeight: 'bold'
                        }}>
                        {getStatusText(invite.status)}
                      </td>
                      <td
                        style={{
                          borderBottom: '1px solid #eee',
                          padding: '0.5rem 0'
                        }}>
                        {invite.invite_used_at
                          ? new Date(invite.invite_used_at).toLocaleString()
                          : '\u2014'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          ) : (
            <span>
              {strings('invite_no_codes')}
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default InviteCodes
