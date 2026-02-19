import { Heading, Box, Text, Button, Select } from 'theme-ui'
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
        return 'success'
      case 1:
        return 'info'
      case 2:
        return 'error'
      case 3:
        return 'warning'
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
    <Box>
      <Heading
        as="h3"
        sx={{
          fontSize: [3, null, 4],
          lineHeight: 'body',
          mb: [3, null, 4]
        }}>
        {strings('invite_codes_heading')}
      </Heading>

      {!enabled ? (
        <Text>
          {strings('invite_tree_not_enabled')}
        </Text>
      ) : (
        <>
          <Box
            sx={{
              mb: [3],
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: [2]
            }}>
            <Text sx={{ display: 'block', mb: [2] }}>
              {strings('invite_codes_desc')}
            </Text>
            <Button
              onClick={handleDownloadCsv}
              variant="outline"
              disabled={!conversationId || downloadLoading}
              sx={{ fontSize: [1] }}>
              {downloadLoading ? strings('invite_preparing') : strings('invite_download_csv')}
            </Button>
          </Box>

          {/* Filters */}
          <Box sx={{ mb: [3], p: [3], bg: 'lightGray', borderRadius: 2 }}>
            <Text sx={{ fontWeight: 'bold', mb: [2] }}>{strings('invite_filters')}</Text>
            <Box sx={{ display: 'flex', gap: [3], alignItems: 'end', flexWrap: 'wrap' }}>
              <Box>
                <Text sx={{ display: 'block', mb: [1], fontSize: [1] }}>{strings('invite_filter_wave')}</Text>
                <Select
                  value={waveFilter}
                  onChange={(e) => setWaveFilter(e.target.value)}
                  sx={{ minWidth: '120px' }}>
                  <option value="">{strings('invite_all_waves')}</option>
                  {availableWaves.map((wave) => (
                    <option key={wave.id} value={wave.id}>
                      {strings('invite_wave_n', { wave: wave.wave })}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text sx={{ display: 'block', mb: [1], fontSize: [1] }}>{strings('invite_filter_status')}</Text>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ minWidth: '140px' }}>
                  <option value="">{strings('invite_all_statuses')}</option>
                  <option value="0">{strings('invite_status_unused')}</option>
                  <option value="1">{strings('invite_status_used')}</option>
                  <option value="2">{strings('invite_status_revoked')}</option>
                  <option value="3">{strings('invite_status_expired')}</option>
                </Select>
              </Box>

              {(waveFilter || statusFilter !== '') && (
                <Button variant="outline" onClick={handleClearFilters} sx={{ fontSize: [1] }}>
                  {strings('invite_clear_filters')}
                </Button>
              )}
            </Box>
          </Box>

          {loading ? (
            <Spinner />
          ) : error ? (
            <Text sx={{ color: 'error' }}>{String(error)}</Text>
          ) : invites.length > 0 ? (
            <Box>
              <Text sx={{ mb: [2], fontWeight: 'bold' }}>
                {strings('invite_found_codes', { count: pagination?.total || invites.length })}
              </Text>
              <Box as="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th
                      sx={{
                        textAlign: 'left',
                        borderBottom: '1px solid',
                        borderColor: 'mediumGray',
                        pb: [2],
                        pr: [3]
                      }}>
                      {strings('invite_col_code')}
                    </th>
                    <th
                      sx={{
                        textAlign: 'left',
                        borderBottom: '1px solid',
                        borderColor: 'mediumGray',
                        pb: [2],
                        pr: [3]
                      }}>
                      {strings('invite_col_wave')}
                    </th>
                    <th
                      sx={{
                        textAlign: 'left',
                        borderBottom: '1px solid',
                        borderColor: 'mediumGray',
                        pb: [2],
                        pr: [3]
                      }}>
                      {strings('invite_col_status')}
                    </th>
                    <th
                      sx={{
                        textAlign: 'left',
                        borderBottom: '1px solid',
                        borderColor: 'mediumGray',
                        pb: [2]
                      }}>
                      {strings('invite_col_used_at')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'lightGray',
                          py: [2],
                          pr: [3],
                          fontFamily: 'monospace',
                          fontSize: [1]
                        }}>
                        {invite.invite_code}
                      </td>
                      <td
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'lightGray',
                          py: [2],
                          pr: [3]
                        }}>
                        {invite.wave || strings('invite_na')}
                      </td>
                      <td
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'lightGray',
                          py: [2],
                          pr: [3],
                          color: getStatusColor(invite.status),
                          fontWeight: 'bold'
                        }}>
                        {getStatusText(invite.status)}
                      </td>
                      <td
                        sx={{
                          borderBottom: '1px solid',
                          borderColor: 'lightGray',
                          py: [2]
                        }}>
                        {invite.invite_used_at
                          ? new Date(invite.invite_used_at).toLocaleString()
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Box>

              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </Box>
          ) : (
            <Text>
              {strings('invite_no_codes')}
            </Text>
          )}
        </>
      )}
    </Box>
  )
}

export default InviteCodes
