// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { useAuth } from 'react-oidc-context'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useRef } from 'react'

import { populateConversationStatsStore } from '../../../actions'
import { useConversationData } from '../../../util/conversation_data'
import Commenters from './Commenters'
import dateSetupUtil from '../../../util/data-export-date-setup'
import NumberCards from './NumberCards'
import Voters from './Voters'
import strings from '../../../strings/strings'

const ConversationStats = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const { isAuthenticated, isLoading } = useAuth()
  const stats = useSelector((state) => state.stats)
  const conversationData = useConversationData()
  const { conversation_stats } = stats
  const times = dateSetupUtil()

  const getChartSize = () => {
    if (typeof window === 'undefined') return 350
    const width = window.innerWidth
    if (width < 480) return Math.min(width - 64, 350)
    if (width < 768) return 400
    return 500
  }

  const [chartSize, setChartSize] = useState(getChartSize())
  const chartMargins = { top: 20, right: 20, bottom: 50, left: 70 }

  const [state] = useState({
    ...times,
    until: undefined
  })

  const getStatsRepeatedlyRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      setChartSize(getChartSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const loadStats = () => {
    const until = state.until
    dispatch(populateConversationStatsStore(params.conversation_id, until))
  }

  const stopPolling = () => {
    if (getStatsRepeatedlyRef.current) {
      clearInterval(getStatsRepeatedlyRef.current)
      getStatsRepeatedlyRef.current = null
    }
  }

  const startPolling = () => {
    stopPolling()
    loadStats()
    getStatsRepeatedlyRef.current = setInterval(() => {
      loadStats()
    }, 10000)
  }

  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [])

  useEffect(() => {
    const currentIsMod = conversationData?.is_mod
    const currentConversationId = params?.conversation_id

    const shouldStartPolling =
      conversationData?.conversation_id === currentConversationId &&
      currentIsMod &&
      !getStatsRepeatedlyRef.current

    if (shouldStartPolling) {
      startPolling()
    }
  }, [isLoading, isAuthenticated, conversationData, params.conversation_id])

  const loading = !conversation_stats.firstCommentTimes || !conversation_stats.firstVoteTimes

  if (loading) return <div>{strings('stats_loading')}</div>

  return (
    <div>
      <h3 className="mb-3 mb-xl-4" style={{ fontSize: '20px', lineHeight: 1.5 }}>
        {strings('stats_heading')}
      </h3>
      <NumberCards data={conversation_stats} />
      <Voters
        firstVoteTimes={conversation_stats.firstVoteTimes}
        size={chartSize}
        margin={chartMargins}
      />
      <Commenters
        firstCommentTimes={conversation_stats.firstCommentTimes}
        size={chartSize}
        margin={chartMargins}
      />
    </div>
  )
}

export default ConversationStats
