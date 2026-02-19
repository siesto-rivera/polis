/* eslint-disable */
// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useState, useEffect } from 'react'
import { Box, Flex, Heading, Text, Card } from 'theme-ui'
import PropTypes from 'prop-types'
import strings from '../../../strings/strings'

const StatCard = ({ title, value, color = 'primary' }) => (
  <Card
    sx={{
      p: [2, 3, 3],
      textAlign: 'center',
      minWidth: ['120px', '140px', '150px'],
      flex: ['1 1 45%', '0 0 auto', '0 0 auto']
    }}>
    <Text sx={{ fontSize: [2, 3, 3], fontWeight: 'bold', color: color }}>{value}</Text>
    <Text sx={{ fontSize: [0, 1, 1], color: 'textSecondary', mt: 1, ml: [1, 2, 2] }}>{title}</Text>
  </Card>
)

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
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Text>{strings('topic_loading_statistics')}</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Text sx={{ color: 'error' }}>{strings('topic_error', { error })}</Text>
      </Box>
    )
  }

  if (!stats) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Text>{strings('topic_stats_no_data')}</Text>
      </Box>
    )
  }

  const completionRate =
    stats.total_topics > 0
      ? (((stats.total_topics - stats.pending) / stats.total_topics) * 100).toFixed(1)
      : 0

  return (
    <Box>
      <Heading as="h3" sx={{ mb: 4 }}>
        {strings('topic_stats_heading')}
      </Heading>

      <Flex sx={{ gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <StatCard title={strings('topic_stats_total')} value={stats.total_topics} />
        <StatCard title={strings('topic_stats_pending')} value={stats.pending} color="gray" />
        <StatCard title={strings('topic_stats_accepted')} value={stats.accepted} color="primary" />
        <StatCard title={strings('topic_stats_rejected')} value={stats.rejected} color="error" />
        <StatCard title={strings('topic_stats_completion')} value={`${completionRate}%`} color="info" />
      </Flex>

      <Box sx={{ mt: 4 }}>
        <Heading as="h4" sx={{ mb: 3, fontSize: 2 }}>
          {strings('topic_stats_progress_heading')}
        </Heading>

        <Box sx={{ bg: 'muted', borderRadius: 'default', p: 3 }}>
          <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Text sx={{ fontWeight: 'bold' }}>{strings('topic_stats_overall')}</Text>
            <Text sx={{ fontSize: 1 }}>{strings('topic_stats_complete', { rate: completionRate })}</Text>
          </Flex>

          <Box
            sx={{
              bg: 'background',
              borderRadius: 'default',
              overflow: 'hidden',
              height: '20px'
            }}>
            <Flex sx={{ height: '100%' }}>
              <Box
                sx={{
                  bg: 'primary',
                  width: `${
                    stats.total_topics > 0 ? (stats.accepted / stats.total_topics) * 100 : 0
                  }%`,
                  transition: 'width 0.3s ease'
                }}
              />
              <Box
                sx={{
                  bg: 'error',
                  width: `${
                    stats.total_topics > 0 ? (stats.rejected / stats.total_topics) * 100 : 0
                  }%`,
                  transition: 'width 0.3s ease'
                }}
              />
            </Flex>
          </Box>

          <Flex
            sx={{
              justifyContent: 'space-between',
              mt: 2,
              fontSize: 0,
              flexWrap: 'wrap',
              gap: [1, 2, 2]
            }}>
            <Text sx={{ color: 'primary', whiteSpace: 'nowrap' }}>{strings('topic_stats_accepted_count', { count: stats.accepted })}</Text>
            <Text sx={{ color: 'error', whiteSpace: 'nowrap' }}>{strings('topic_stats_rejected_count', { count: stats.rejected })}</Text>
            <Text sx={{ color: 'gray', whiteSpace: 'nowrap' }}>{strings('topic_stats_pending_count', { count: stats.pending })}</Text>
          </Flex>
        </Box>
      </Box>

      {stats.total_topics === 0 && (
        <Box sx={{ textAlign: 'center', py: 4, mt: 4 }}>
          <Text sx={{ color: 'textSecondary' }}>
            {strings('topic_stats_no_topics')}
          </Text>
          <Text sx={{ fontSize: 0, color: 'textSecondary', mt: 2 }}>
            {strings('topic_stats_run_pipeline')}
          </Text>
        </Box>
      )}
    </Box>
  )
}

TopicStats.propTypes = {
  conversation_id: PropTypes.string.isRequired
}

export default TopicStats
