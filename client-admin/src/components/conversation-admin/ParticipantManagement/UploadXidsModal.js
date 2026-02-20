import Button from 'react-bootstrap/Button'
import { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import strings from '../../../strings/strings'

/**
 * Parses file content to extract XIDs.
 * Supports CSV (with or without headers) and plain text (one per line).
 * @param {string} content - File content as text
 * @returns {string} - Newline-separated list of XIDs
 */
const parseFileContent = (content) => {
  if (!content || !content.trim()) {
    return ''
  }

  const lines = content.split(/\r?\n/).filter((line) => line.trim())
  if (lines.length === 0) {
    return ''
  }

  // Check if first line looks like CSV headers (e.g., "pid,xid", "xid", "XID", etc.)
  const firstLine = lines[0].toLowerCase()
  const hasHeaders =
    firstLine.includes('xid') ||
    firstLine.includes('pid') ||
    (firstLine.includes(',') && !firstLine.match(/^\d+/))

  // If headers detected, skip first line
  const dataLines = hasHeaders ? lines.slice(1) : lines

  const xids = []
  for (const line of dataLines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue // Skip empty lines and comments

    // If CSV format, extract XID
    if (line.includes(',')) {
      // Split by comma, handling quoted values
      const parts = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            // Escaped quote
            current += '"'
            i++
          } else {
            // Toggle quote state
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      parts.push(current.trim()) // Add last part

      // If we have pid,xid format, use second column; otherwise use first
      if (parts.length >= 2) {
        // If first column is empty or numeric (pid), use second column (xid)
        // Otherwise use first column (assuming it's xid without pid)
        const firstIsEmpty = !parts[0] || parts[0].trim() === ''
        const firstIsNumeric = /^\d+$/.test(parts[0])
        const xid = firstIsEmpty || firstIsNumeric ? parts[1] : parts[0]
        if (xid && xid.trim()) {
          xids.push(xid.trim())
        }
      } else if (parts.length === 1) {
        // Single column, use it
        if (parts[0] && parts[0].trim()) {
          xids.push(parts[0].trim())
        }
      }
    } else {
      // Plain text, one XID per line
      xids.push(trimmed)
    }
  }

  // Remove duplicates and return as newline-separated string
  const uniqueXids = Array.from(new Set(xids.filter((xid) => xid && typeof xid === 'string')))
  return uniqueXids.join('\n')
}

const UploadXidsModal = ({ isOpen, onClose, onUpload, conversationId }) => {
  const [xidsText, setXidsText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [replaceAll, setReplaceAll] = useState(false)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  const handleFileRead = useCallback((file) => {
    if (!file) return

    setIsProcessing(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target.result
        if (typeof content !== 'string') {
          throw new Error('File content is not text')
        }
        const parsedXids = parseFileContent(content)
        // Ensure we always set a string
        if (typeof parsedXids !== 'string') {
          throw new Error('Parsing failed: expected string result')
        }
        setXidsText(parsedXids)
      } catch (error) {
        alert(`Error reading file: ${error.message}`)
      } finally {
        setIsProcessing(false)
      }
    }
    reader.onerror = () => {
      alert('Error reading file')
      setIsProcessing(false)
    }
    reader.readAsText(file)
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileRead(file)
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileRead(file)
    }
  }

  const handleUpload = () => {
    // Parse textarea content into array of XIDs
    const xids = xidsText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (xids.length === 0) {
      alert('Please enter at least one XID')
      return
    }

    if (onUpload) {
      onUpload(xids, replaceAll)
    }
  }

  const handleClose = () => {
    setXidsText('')
    setIsDragging(false)
    setReplaceAll(false)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={handleClose}>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '0.25rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          className="d-flex p-3 justify-content-between align-items-center"
          style={{ borderBottom: '1px solid #eee' }}>
          <h3 style={{ lineHeight: 1.5, margin: 0 }}>
            {strings('participants_upload_heading')}
          </h3>
          <Button variant="outline-secondary" size="sm" onClick={handleClose}>
            &#10005;
          </Button>
        </div>

        {/* Content */}
        <div className="p-3" style={{ overflow: 'auto', flex: 1 }}>
          <span className="mb-3" style={{ color: 'inherit', fontSize: '0.875rem' }}>
            {strings('participants_upload_desc')}
          </span>

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="rounded p-3 mb-3 text-center"
            style={{
              border: `2px dashed ${isDragging ? 'var(--bs-primary)' : '#ccc'}`,
              backgroundColor: isDragging ? '#f0f0f0' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,.text"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            {isProcessing ? (
              <span style={{ color: '#999' }}>{strings('participants_processing')}</span>
            ) : (
              <>
                <span className="mb-2 d-block" style={{ fontSize: '0.875rem' }}>
                  {isDragging ? strings('participants_drop_here') : strings('participants_browse_or_drop')}
                </span>
                <span style={{ color: '#999', fontSize: '0.75rem' }}>{strings('participants_supports_csv')}</span>
              </>
            )}
          </div>

          {/* Text input */}
          <div className="mb-3">
            <label
              className="d-block mb-2"
              style={{
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}>
              {strings('participants_allowed_xids')}
            </label>
            <textarea
              ref={textareaRef}
              value={xidsText}
              onChange={(e) => setXidsText(e.target.value)}
              placeholder={strings('participants_paste_placeholder')}
              style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                width: '100%',
                minHeight: '300px',
                maxHeight: '400px',
                resize: 'vertical',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #ccc',
                backgroundColor: '#fff'
              }}
            />
          </div>

          {/* Replace all checkbox */}
          <div className="d-flex align-items-start mb-2">
            <div style={{ flexShrink: 0, position: 'relative', top: -0.5 }}>
              <input
                type="checkbox"
                id="replaceAll"
                checked={replaceAll}
                onChange={(e) => setReplaceAll(e.target.checked)}
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
              <label
                htmlFor="replaceAll"
                style={{
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}>
                {strings('participants_replace_all')}
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="d-flex p-3 justify-content-end"
          style={{ borderTop: '1px solid #eee', gap: '0.5rem' }}>
          <Button variant="outline-secondary" onClick={handleClose}>
            {strings('participants_cancel')}
          </Button>
          <Button onClick={handleUpload} disabled={!xidsText.trim()}>
            {strings('participants_upload_xids')}
          </Button>
        </div>
      </div>
    </div>
  )
}

UploadXidsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  conversationId: PropTypes.string
}

export default UploadXidsModal
