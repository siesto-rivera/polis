import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types'
import { useState } from 'react'
import PolisNet from '../../../util/net'
import strings from '../../../strings/strings'

const XidsInUseTable = ({ xids = [], conversationId }) => {
  const [downloadLoading, setDownloadLoading] = useState(false)

  const handleDownloadCsv = async () => {
    if (!conversationId) return
    try {
      setDownloadLoading(true)
      const token = await PolisNet.getAccessTokenSilentlySPA()

      const url = `/api/v3/xids/csv?conversation_id=${encodeURIComponent(conversationId)}`

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
      a.download = `xids_in_use_${conversationId}_${ts}.csv`
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

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleDownloadCsv}
          disabled={downloadLoading || !conversationId}>
          {downloadLoading ? strings('participants_preparing') : strings('participants_download_csv')}
        </Button>
      </div>
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
                fontSize: '0.875rem',
                borderRight: '1px solid #ccc'
              }}>
              {strings('participants_col_xid')}
            </th>
            <th
              style={{
                padding: '0.5rem 1rem',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
              {strings('participants_col_votes')}
            </th>
          </tr>
        </thead>
        <tbody>
          {xids.map((xidRecord, index) => (
            <tr
              key={`${xidRecord.pid}-${index}`}
              className="polis-table-row-hover"
              style={{
                borderBottom: '1px solid #eee'
              }}>
              <td
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  borderRight: '1px solid #eee'
                }}>
                {xidRecord.pid}
              </td>
              <td
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  wordBreak: 'break-all',
                  borderRight: '1px solid #eee'
                }}>
                {xidRecord.xid}
              </td>
              <td
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem'
                }}>
                {xidRecord.vote_count ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

XidsInUseTable.propTypes = {
  xids: PropTypes.arrayOf(
    PropTypes.shape({
      pid: PropTypes.number.isRequired,
      xid: PropTypes.string.isRequired,
      vote_count: PropTypes.number
    })
  ),
  conversationId: PropTypes.string
}

export default XidsInUseTable
