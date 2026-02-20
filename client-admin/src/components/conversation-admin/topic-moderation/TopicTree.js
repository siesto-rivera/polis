/* eslint-disable */
// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { Link, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import strings from '../../../strings/strings'
import colors from '../../../theme/colors'

const TopicTree = ({ conversation_id }) => {
  const [selectedLayer, setSelectedLayer] = useState('0')
  const [expandedTopics, setExpandedTopics] = useState(new Set())
  const [topicsData, setTopicsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()

  const loadTopics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/v3/topicMod/topics?conversation_id=${conversation_id}`)
      const data = await response.json()
      if (data.status === 'success') {
        setTopicsData(data.topics_by_layer || {})
      } else {
        setError(data.message || 'Failed to load topics')
      }
    } catch (err) {
      setError(strings('topic_network_error_topics'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopics()
  }, [conversation_id])

  const toggleTopic = (topicKey) => {
    const newExpanded = new Set(expandedTopics)
    if (newExpanded.has(topicKey)) {
      newExpanded.delete(topicKey)
    } else {
      newExpanded.add(topicKey)
    }
    setExpandedTopics(newExpanded)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return colors.primary
      case 'rejected':
        return colors.error
      default:
        return colors.gray
    }
  }

  const moderateTopic = async (topicKey, action) => {
    try {
      const response = await fetch('/api/v3/topicMod/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversation_id: conversation_id,
          topic_key: topicKey,
          action: action,
          moderator: 'admin' // TODO: Get from auth state
        })
      })
      const data = await response.json()
      if (data.status === 'success') {
        loadTopics()
      } else {
        console.error('Moderation failed:', data.message)
      }
    } catch (err) {
      console.error('Network error during moderation:', err)
    }
  }

  const renderTopic = (topic, layerId, clusterId) => {
    const topicKey = topic.topic_key || `${layerId}_${clusterId}`
    const isExpanded = expandedTopics.has(topicKey)
    const status = topic.moderation?.status || 'pending'
    const commentCount = Number(topic.moderation?.comment_count || 0)
    return (
      <div
        key={topicKey}
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: 4,
          padding: 12,
          marginBottom: 8,
          backgroundColor: colors.background
        }}>
        <div
          className="d-flex"
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            gap: 0
          }}>
          <div style={{ flex: 1 }}>
            <div className="d-flex" style={{ alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => toggleTopic(topicKey)}
                style={{ padding: 4, fontSize: 12, minWidth: 32 }}>
                {isExpanded ? '−' : '+'}
              </Button>
              <span style={{ fontWeight: 'bold', color: getStatusColor(status), fontSize: 16 }}>
                {strings('topic_layer', { id: layerId })}, {strings('topic_cluster', { id: clusterId })}
              </span>
              <span className="text-polis-secondary" style={{ fontSize: 12, marginLeft: 8 }}>{strings('topic_status_label', { status })}</span>
            </div>
            <span style={{ marginBottom: 8, fontSize: 16, wordWrap: 'break-word', display: 'block' }}>
              {topic.topic_name || strings('topic_unnamed')}
            </span>
            <span className="text-polis-secondary" style={{ fontSize: 12, marginLeft: 8 }}>
              {commentCount > 0 ? strings('topic_n_comments', { count: commentCount }) : strings('topic_no_comments')}
            </span>
          </div>
          <div
            className="d-flex"
            style={{
              gap: 8,
              flexDirection: 'row',
              flexWrap: 'nowrap'
            }}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => moderateTopic(topicKey, 'accept')}
              disabled={status === 'accepted'}
              style={{ fontSize: 14, paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}>
              {strings('topic_accept')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => moderateTopic(topicKey, 'reject')}
              disabled={status === 'rejected'}
              style={{ fontSize: 14, paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}>
              {strings('topic_reject')}
            </Button>
            <Link to={`/m/${conversation_id}/topics/topic/${encodeURIComponent(topicKey)}`}>
              <Button
                variant="outline-secondary"
                size="sm"
                style={{ fontSize: 14, paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, width: '100%' }}>
                {strings('topic_view_comments')}
              </Button>
            </Link>
          </div>
        </div>
        {isExpanded && (
          <div style={{ marginTop: 12, paddingLeft: 16, borderLeft: `2px solid ${colors.border}` }}>
            <span className="text-polis-secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
              {strings('topic_model', { model: topic.model_name || strings('topic_unknown') })}
            </span>
            <span className="text-polis-secondary" style={{ fontSize: 12, display: 'block' }}>
              {strings('topic_created_at', { date: topic.created_at ? new Date(topic.created_at).toLocaleString() : strings('topic_unknown') })}
            </span>
            {topic.moderation?.moderator && (
              <span className="text-polis-secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                {strings('topic_moderated_by', { moderator: topic.moderation.moderator })}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderLayer = (layerId, topics) => {
    const layerTopics = Object.entries(topics).sort(([a], [b]) => parseInt(a) - parseInt(b))
    return (
      <div key={layerId} style={{ marginBottom: 16 }}>
        <h4 style={{ marginBottom: 12, fontSize: 16 }}>
          {strings('topic_layer_count', { id: layerId, count: layerTopics.length })}
        </h4>
        {layerTopics.map(([clusterId, topic]) => renderTopic(topic, layerId, clusterId))}
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
        <span>{strings('topic_loading_topics')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
        <span style={{ color: colors.error }}>{strings('topic_error', { error })}</span>
        <Button style={{ marginTop: 8 }} onClick={loadTopics}>
          {strings('topic_retry')}
        </Button>
      </div>
    )
  }

  if (!topicsData || Object.keys(topicsData).length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
        <span>{strings('topic_no_topics')}</span>
        <span className="text-polis-secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
          {strings('topic_no_topics_hint')}
        </span>
      </div>
    )
  }

  const layers = Object.entries(topicsData).sort(([a], [b]) => parseInt(a) - parseInt(b))

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>{strings('topic_view_layer')}</span>
        <div className="d-flex" style={{ gap: 8, flexWrap: 'wrap' }}>
          {layers.map(([layerId]) => (
            <Button
              key={layerId}
              variant={selectedLayer === layerId ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => setSelectedLayer(layerId)}
              style={{ fontSize: 16, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
              {strings('topic_layer', { id: layerId })}
            </Button>
          ))}
          <Button
            variant={selectedLayer === 'all' ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setSelectedLayer('all')}
            style={{ fontSize: 16, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
            {strings('topic_all_layers')}
          </Button>
        </div>
      </div>
      {selectedLayer === 'all'
        ? layers.map(([layerId, topics]) => renderLayer(layerId, topics))
        : topicsData[selectedLayer] && renderLayer(selectedLayer, topicsData[selectedLayer])}
    </div>
  )
}

TopicTree.propTypes = {
  conversation_id: PropTypes.string.isRequired
}

export default TopicTree
