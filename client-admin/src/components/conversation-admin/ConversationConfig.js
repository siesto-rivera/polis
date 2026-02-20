// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import emoji from 'react-easy-emoji'

import { CheckboxField } from './CheckboxField'
import { useConversationData } from '../../util/conversation_data'
import ModerateCommentsSeed from './ModerateCommentSeed'
import Spinner from '../framework/Spinner'
import {
  handleConversationDataUpdate,
  optimisticConversationDataUpdateOnTyping
} from '../../actions'
import strings from '../../strings/strings'

const inputStyle = {
  display: 'block',
  fontFamily: "'Space Mono', monospace",
  fontSize: '16px',
  width: '100%',
  maxWidth: '35em',
  borderRadius: 2,
  padding: '8px',
  border: '1px solid #60656f'
}

const ConversationConfig = () => {
  const dispatch = useDispatch()
  const conversationData = useConversationData()
  const { loading, error } = conversationData
  const topicRef = useRef(null)
  const descriptionRef = useRef(null)

  const handleStringValueChange = useCallback(
    (field, value) => {
      let val = value
      if (field === 'help_bgcolor' || field === 'help_color') {
        if (!val.length) {
          val = 'default'
        }
      }
      dispatch(handleConversationDataUpdate(conversationData, field, val))
    },
    [dispatch, conversationData]
  )

  const handleConfigInputTyping = useCallback(
    (field, value) => {
      dispatch(optimisticConversationDataUpdateOnTyping(conversationData, field, value))
    },
    [dispatch, conversationData]
  )

  if (loading && !topicRef.current && !descriptionRef.current) {
    return <Spinner />
  }

  return (
    <div>
      <h3 className="mb-3 mb-xl-4" style={{ fontSize: '20px', lineHeight: 1.5 }}>
        {strings('config_heading')}
      </h3>
      <div className="mb-4">
        {loading ? <span>{emoji('💾')} {strings('config_saving')}</span> : <span>{emoji('⚡')} {strings('config_up_to_date')}</span>}
        {error ? <span>{strings('config_error_saving')}</span> : null}
      </div>

      <CheckboxField field="is_active" label={strings('config_is_active_label')}>
        {strings('config_is_active_desc')}
      </CheckboxField>

      <div className="mb-3">
        <span className="d-block mb-2">{strings('config_topic')}</span>
        <input
          ref={topicRef}
          style={inputStyle}
          data-testid="topic"
          onBlur={(e) => handleStringValueChange('topic', e.target.value)}
          onChange={(e) => handleConfigInputTyping('topic', e.target.value)}
          value={conversationData.topic || ''}
        />
      </div>

      <div className="mb-3">
        <span className="d-block mb-2">{strings('config_description')}</span>
        <textarea
          ref={descriptionRef}
          style={{ ...inputStyle, height: '7em', resize: 'none' }}
          data-testid="description"
          onBlur={(e) => handleStringValueChange('description', e.target.value)}
          onChange={(e) => handleConfigInputTyping('description', e.target.value)}
          value={conversationData.description || ''}
        />
      </div>

      <h6 className="my-3 my-xl-4" style={{ fontSize: '14px', lineHeight: 1.5 }}>
        {strings('config_seed_comments')}
      </h6>
      <ModerateCommentsSeed params={{ conversation_id: conversationData.conversation_id }} />

      <h6 className="my-3 my-xl-4" style={{ fontSize: '14px', lineHeight: 1.5 }}>
        {strings('config_customize_ui')}
      </h6>

      <CheckboxField field="vis_type" label={strings('config_vis_label')} isIntegerBool>
        {strings('config_vis_desc')}
      </CheckboxField>

      <CheckboxField field="write_type" label={strings('config_write_label')} isIntegerBool>
        {strings('config_write_desc')}
      </CheckboxField>

      <CheckboxField field="help_type" label={strings('config_help_label')} isIntegerBool>
        {strings('config_help_desc')}
      </CheckboxField>

      <CheckboxField
        field="subscribe_type"
        label={strings('config_subscribe_label')}
        isIntegerBool>
        {strings('config_subscribe_desc')}
      </CheckboxField>

      <CheckboxField field="strict_moderation">
        {strings('config_strict_mod_desc')}
      </CheckboxField>

      <CheckboxField field="treevite_enabled" label={strings('config_treevite_label')}>
        {strings('config_treevite_desc')}
      </CheckboxField>

      <CheckboxField field="importance_enabled" label={strings('config_importance_label')}>
        {strings('config_importance_desc')}
      </CheckboxField>
    </div>
  )
}

export default ConversationConfig
