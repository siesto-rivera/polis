import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import PolisNet from '../../../util/net'
import Spinner from '../../framework/Spinner'
import Pagination from '../Pagination'
import UploadXidsModal from './UploadXidsModal'
import strings from '../../../strings/strings'

const XidAllowListTable = ({ conversationId }) => {
  const [xids, setXids] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [limit] = useState(50)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const loadXidAllowList = async (newOffset = 0) => {
    if (!conversationId) return
    setLoading(true)
    setError(null)

    try {
      const res = await PolisNet.polisGet('/api/v3/xidAllowList', {
        conversation_id: conversationId,
        limit,
        offset: newOffset
      })

      setXids(res?.xids || [])
      setPagination(res?.pagination || null)
    } catch (e) {
      setError(e?.responseText || e?.message || 'Failed to load XID Allow List')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (conversationId) {
      loadXidAllowList(0)
    }
  }, [conversationId])

  const handlePageChange = (newOffset) => {
    loadXidAllowList(newOffset)
  }

  const handleDownloadCsv = async () => {
    if (!conversationId) return
    try {
      setDownloadLoading(true)
      const token = await PolisNet.getAccessTokenSilentlySPA()

      const url = `/api/v3/xidAllowList/csv?conversation_id=${encodeURIComponent(conversationId)}`

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
      a.download = `xid_allow_list_${conversationId}_${ts}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (e) {
      alert(e?.message || 'Failed to download CSV')
    } finally {
      setDownloadLoading(false)
    }
  }

  const handleUploadXids = async (xidsList, replaceAll = false) => {
    if (!conversationId || !xidsList || xidsList.length === 0) {
      return
    }

    try {
      setLoading(true)
      await PolisNet.polisPost('/api/v3/xidAllowList', {
        xid_allow_list: xidsList,
        conversation_id: conversationId,
        replace_all: replaceAll
      })

      // Close modal and reload list after successful upload
      setIsUploadModalOpen(false)
      await loadXidAllowList(0) // Reload after upload
    } catch (e) {
      alert(e?.responseText || e?.message || 'Failed to upload XIDs')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !xids.length) {
    return <Spinner />
  }

  if (error) {
    return <span className="mb-3" style={{ color: 'var(--bs-danger)' }}>{error}</span>
  }

  if (xids.length === 0) {
    return (
      <>
        <div className="d-flex justify-content-end mb-2" style={{ gap: '0.5rem' }}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            disabled={!conversationId}>
            {strings('participants_upload_xids')}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleDownloadCsv}
            disabled={downloadLoading || !conversationId}>
            {downloadLoading ? strings('participants_preparing') : strings('participants_download_csv')}
          </Button>
        </div>
        <UploadXidsModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUploadXids}
          conversationId={conversationId}
        />
        <span className="mb-3" style={{ color: '#999' }}>
          {strings('participants_no_allow_list')}
        </span>
      </>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-2" style={{ gap: '0.5rem' }}>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
          disabled={!conversationId}>
          {strings('participants_upload_xids')}
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleDownloadCsv}
          disabled={downloadLoading || !conversationId}>
          {downloadLoading ? strings('participants_preparing') : strings('participants_download_csv')}
        </Button>
      </div>
      <UploadXidsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadXids}
        conversationId={conversationId}
      />
      <table
        className="mb-3"
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
        <thead
          style={{
            backgroundColor: '#f0f0f0',
            borderBottom: '2px solid #ccc'
          }}>
          <tr>
            <th
              style={{
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                borderRight: '1px solid #ccc'
              }}>
              {strings('participants_col_pid')}
            </th>
            <th
              style={{
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
              {strings('participants_col_xid')}
            </th>
          </tr>
        </thead>
        <tbody>
          {xids.map((xidRecord, index) => (
            <tr
              key={`${xidRecord.xid}-${index}`}
              className="polis-table-row-hover"
              style={{
                borderBottom: '1px solid #eee'
              }}>
              <td
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  borderRight: '1px solid #eee',
                  color: xidRecord.pid ? 'inherit' : '#999',
                  fontStyle: xidRecord.pid ? 'normal' : 'italic'
                }}>
                {xidRecord.pid ?? '\u2014'}
              </td>
              <td
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  wordBreak: 'break-all'
                }}>
                {xidRecord.xid}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination pagination={pagination} onPageChange={handlePageChange} loading={loading} />
    </>
  )
}

XidAllowListTable.propTypes = {
  conversationId: PropTypes.string
}

// Expected xids format: [{pid: number | null, xid: string}, ...]

export default XidAllowListTable
