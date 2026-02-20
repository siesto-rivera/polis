/* eslint-disable */
// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link, useParams } from 'react-router-dom'
import strings from '../../../strings/strings'
import colors from '../../../theme/colors'

const TopicDetail = () => {
  const [comments, setComments] = useState([])
  const [selectedComments, setSelectedComments] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectAll, setSelectAll] = useState(false)
  const params = useParams()
  const { conversation_id, topicKey: encodedTopicKey } = params
  const topicKey = decodeURIComponent(encodedTopicKey)

  const loadTopicComments = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/v3/topicMod/topics/${encodeURIComponent(
          topicKey
        )}/comments?conversation_id=${conversation_id}`
      )
      const data = await response.json()

      if (data.status === 'success') {
        setComments(data.comments || [])
        setSelectedComments(new Set())
      } else {
        setError(data.message || 'Failed to load comments')
      }
    } catch (err) {
      setError(strings('topic_network_error_comments'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopicComments()
  }, [conversation_id, topicKey])

  const toggleComment = (commentId) => {
    const newSelected = new Set(selectedComments)
    if (newSelected.has(commentId)) {
      newSelected.delete(commentId)
    } else {
      newSelected.add(commentId)
    }
    setSelectedComments(newSelected)
    setSelectAll(newSelected.size === comments.length)
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedComments(new Set())
      setSelectAll(false)
    } else {
      setSelectedComments(new Set(comments.map((c) => c.comment_id)))
      setSelectAll(true)
    }
  }

  const moderateSelected = async (action) => {
    if (selectedComments.size === 0) return

    try {
      const response = await fetch('/api/v3/topicMod/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_id: conversation_id,
          comment_ids: Array.from(selectedComments),
          action: action,
          moderator: 'admin' // TODO: Get from auth state
        })
      })
      const data = await response.json()
      if (data.status === 'success') {
        loadTopicComments()
      } else {
        console.error('Moderation failed:', data.message)
      }
    } catch (err) {
      console.error('Network error during moderation:', err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
      case 1:
        return colors.primary
      case 'rejected':
      case -1:
        return colors.error
      case 'meta':
      case 0:
        return colors.lightGray
      default:
        return colors.gray
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
      case 1:
        return strings('topic_status_accepted')
      case 'rejected':
      case -1:
        return strings('topic_status_rejected')
      case 'meta':
      case 0:
        return strings('topic_status_meta')
      default:
        return strings('topic_status_pending')
    }
  }

  const renderComment = (comment) => {
    const isSelected = selectedComments.has(comment.comment_id)
    const status = comment.moderation_status || 'pending'
    return (
      <div
        key={comment.comment_id}
        style={{
          border: `1px solid ${isSelected ? colors.primary : colors.border}`,
          borderRadius: 4,
          padding: 12,
          marginBottom: 8,
          backgroundColor: isSelected ? '#f0f9ff' : colors.background,
          cursor: 'pointer'
        }}
        onClick={() => toggleComment(comment.comment_id)}>
        <div className="d-flex" style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div className="d-flex" style={{ alignItems: 'flex-start', flex: 1 }}>
            <Form.Check
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleComment(comment.comment_id)}
              style={{ marginRight: 12, marginTop: 4 }}
              onClick={(e) => e.stopPropagation()}
            />
            <div style={{ flex: 1 }}>
              <span style={{ marginBottom: 8, lineHeight: 1.5, display: 'block' }}>{comment.comment_text}</span>
              <div className="d-flex text-polis-secondary" style={{ gap: 12, fontSize: 12 }}>
                <span>{strings('topic_comment_id', { id: comment.comment_id })}</span>
                <span>{strings('topic_comment_cluster', { id: comment.cluster_id })}</span>
                <span>{strings('topic_comment_layer', { id: comment.layer_id })}</span>
                {comment.umap_x !== undefined && comment.umap_y !== undefined && (
                  <span>
                    {strings('topic_comment_position', { x: comment.umap_x?.toFixed(2), y: comment.umap_y?.toFixed(2) })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: getStatusColor(status)
              }}>
              {getStatusText(status)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
        <span>{strings('topic_loading_comments')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
        <span style={{ color: colors.error }}>{strings('topic_error', { error })}</span>
        <Button style={{ marginTop: 8 }} onClick={loadTopicComments}>
          {strings('topic_retry')}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <Link to={`/m/${conversation_id}/topics`}>
            <Button variant="outline-secondary" size="sm" style={{ marginRight: 12 }}>
              {strings('topic_back_to_topics')}
            </Button>
          </Link>
          <h3 style={{ display: 'inline' }}>
            {strings('topic_topic_label', { key: topicKey })}
          </h3>
        </div>
        <span className="text-polis-secondary">{strings('topic_comment_count', { count: comments.length })}</span>
      </div>
      {comments.length > 0 && (
        <>
          <div
            className="d-flex"
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              padding: 12,
              backgroundColor: colors.muted,
              borderRadius: 4
            }}>
            <div className="d-flex" style={{ alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}>
                <Form.Check
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  style={{ marginRight: 8 }}
                  inline
                />
                {strings('topic_select_all', { count: selectedComments.size })}
              </label>
            </div>
            <div className="d-flex" style={{ gap: 8 }}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => moderateSelected('accept')}
                disabled={selectedComments.size === 0}>
                {strings('topic_accept_selected')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => moderateSelected('reject')}
                disabled={selectedComments.size === 0}>
                {strings('topic_reject_selected')}
              </Button>
            </div>
          </div>
          <div>{comments.map(renderComment)}</div>
        </>
      )}
      {comments.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
          <span>{strings('topic_no_comments_for_topic')}</span>
        </div>
      )}
    </div>
  )
}

export default TopicDetail
