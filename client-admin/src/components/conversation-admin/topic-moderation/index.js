/* eslint-disable */
// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Routes, Route, Link, useParams, useLocation } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'
import React, { useEffect, useRef } from 'react'

import strings from '../../../strings/strings'
import { hasDelphiEnabled } from '../../../util/auth'
import { useConversationData } from '../../../util/conversation_data'
import ProximityVisualization from './ProximityVisualization'
import TopicDetail from './TopicDetail'
import TopicStats from './TopicStats'
import TopicTree from './TopicTree'

const pollFrequency = 60000

const TopicModeration = () => {
  const params = useParams()
  const location = useLocation()
  const conversationData = useConversationData()
  const getTopicsRepeatedly = useRef(null)
  const { user: authUser } = useAuth()

  const loadTopics = () => {
    // Dispatch actions to load topics data
    // TODO: Implement actions for loading topic moderation data
    console.log('Loading topics for conversation:', params.conversation_id)
  }

  useEffect(() => {
    loadTopics()
    // Temporarily disable polling to debug crash
    // getTopicsRepeatedly.current = setInterval(() => {
    //   loadTopics()
    // }, pollFrequency)

    return () => {
      clearInterval(getTopicsRepeatedly.current)
    }
  }, [params.conversation_id])

  // Check if conversationData is still loading
  if (!conversationData || conversationData.loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}>
        <div>{strings('topic_loading')}</div>
      </div>
    )
  }

  const { conversation_id } = params
  const baseUrl = `/m/${conversation_id}/topics`
  const url = location.pathname.split('/')[4]

  return (
    <div>
      <h3
        style={{
          fontSize: 24,
          lineHeight: 1.5,
          marginBottom: 16
        }}>
        {strings('topic_heading')}
      </h3>
      {hasDelphiEnabled(authUser) ? (
        <div className="d-flex" style={{ marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
          <Link
            className={url ? '' : 'fw-bold'}
            style={{ whiteSpace: 'nowrap' }}
            to={baseUrl}>
            {strings('topic_topics_tree')}
          </Link>
          <Link
            className={url === 'proximity' ? 'fw-bold' : ''}
            style={{ whiteSpace: 'nowrap' }}
            to={`${baseUrl}/proximity`}>
            {strings('topic_proximity_map')}
          </Link>
          <Link
            className={url === 'stats' ? 'fw-bold' : ''}
            style={{ whiteSpace: 'nowrap' }}
            to={`${baseUrl}/stats`}>
            {strings('topic_statistics')}
          </Link>
        </div>
      ) : (
        <>
          <h3>{strings('topic_not_enabled')}</h3>
          <p>{strings('topic_pro_feature')}</p>
        </>
      )}
      {hasDelphiEnabled(authUser) && (
        <div>
          <Routes>
            <Route path="/" element={<TopicTree conversation_id={conversation_id} />} />
            <Route path="proximity" element={<ProximityVisualization />} />
            <Route path="stats" element={<TopicStats conversation_id={conversation_id} />} />
            <Route path="topic/:topicKey" element={<TopicDetail />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default TopicModeration
