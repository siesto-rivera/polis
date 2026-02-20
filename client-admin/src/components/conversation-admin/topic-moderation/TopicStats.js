/* eslint-disable */
// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import strings from '../../../strings/strings'
import colors from '../../../theme/colors'

const StatCard = ({ title, value, color = 'primary' }) => {
  const colorValue = colors[color] || color
  return (
    <div
      style={{
        padding: 12,
        textAlign: 'center',
        minWidth: 150,
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        backgroundColor: colors.background
      }}>
      <span style={{ fontSize: 20, fontWeight: 'bold', color: colorValue, display: 'block' }}>{value}</span>
      <span className="text-polis-secondary" style={{ fontSize: 14, marginTop: 4, marginLeft: 8, display: 'block' }}>{title}</span>
    </div>
  )
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string
}

const TopicStats = ({ conversation_id }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/v3/topicMod/stats?conversation_id=${conversation_id}`)
        const data = await response.json()

        if (data.status === 'success') {
          setStats(data.stats)
        } else {
          setError(data.message || 'Failed to load statistics')
        }
      } catch (err) {
        setError(strings('topic_network_error_statistics'))
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [conversation_id])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
        <span>{strings('topic_loading_statistics')}</span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
        <span style={{ color: colors.error }}>{strings('topic_error', { error })}</span>
      </div>
    )
  }

  if (!stats) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
        <span>{strings('topic_stats_no_data')}</span>
      </div>
    )
  }

  const completionRate =
    stats.total_topics > 0
      ? (((stats.total_topics - stats.pending) / stats.total_topics) * 100).toFixed(1)
      : 0

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>
        {strings('topic_stats_heading')}
      </h3>

      <div className="d-flex" style={{ gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard title={strings('topic_stats_total')} value={stats.total_topics} />
        <StatCard title={strings('topic_stats_pending')} value={stats.pending} color="gray" />
        <StatCard title={strings('topic_stats_accepted')} value={stats.accepted} color="primary" />
        <StatCard title={strings('topic_stats_rejected')} value={stats.rejected} color="error" />
        <StatCard title={strings('topic_stats_completion')} value={`${completionRate}%`} color="info" />
      </div>

      <div style={{ marginTop: 16 }}>
        <h4 style={{ marginBottom: 12, fontSize: 16 }}>
          {strings('topic_stats_progress_heading')}
        </h4>

        <div style={{ backgroundColor: colors.muted, borderRadius: 4, padding: 12 }}>
          <div className="d-flex" style={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 'bold' }}>{strings('topic_stats_overall')}</span>
            <span style={{ fontSize: 14 }}>{strings('topic_stats_complete', { rate: completionRate })}</span>
          </div>

          <div
            style={{
              backgroundColor: colors.background,
              borderRadius: 4,
              overflow: 'hidden',
              height: 20
            }}>
            <div className="d-flex" style={{ height: '100%' }}>
              <div
                style={{
                  backgroundColor: colors.primary,
                  width: `${
                    stats.total_topics > 0 ? (stats.accepted / stats.total_topics) * 100 : 0
                  }%`,
                  transition: 'width 0.3s ease'
                }}
              />
              <div
                style={{
                  backgroundColor: colors.error,
                  width: `${
                    stats.total_topics > 0 ? (stats.rejected / stats.total_topics) * 100 : 0
                  }%`,
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          <div
            className="d-flex"
            style={{
              justifyContent: 'space-between',
              marginTop: 8,
              fontSize: 12,
              flexWrap: 'wrap',
              gap: 8
            }}>
            <span style={{ color: colors.primary, whiteSpace: 'nowrap' }}>{strings('topic_stats_accepted_count', { count: stats.accepted })}</span>
            <span style={{ color: colors.error, whiteSpace: 'nowrap' }}>{strings('topic_stats_rejected_count', { count: stats.rejected })}</span>
            <span style={{ color: colors.gray, whiteSpace: 'nowrap' }}>{strings('topic_stats_pending_count', { count: stats.pending })}</span>
          </div>
        </div>
      </div>

      {stats.total_topics === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16, marginTop: 16 }}>
          <span className="text-polis-secondary">
            {strings('topic_stats_no_topics')}
          </span>
          <span className="text-polis-secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
            {strings('topic_stats_run_pipeline')}
          </span>
        </div>
      )}
    </div>
  )
}

TopicStats.propTypes = {
  conversation_id: PropTypes.string.isRequired
}

export default TopicStats
