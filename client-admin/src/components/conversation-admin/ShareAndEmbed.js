// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Link, useParams } from 'react-router'

import { useConversationData } from '../../util/conversation_data'
import ConversationHasCommentsCheck from './ConversationHasCommentsCheck'
import ParticipantXids from './ParticipantXids'
import Url from '../../util/url'
import strings from '../../strings/strings'

const ShareAndEmbed = () => {
  const params = useParams()
  const conversationData = useConversationData()
  const participantUrl = conversationData.treevite_enabled
    ? Url.urlPrefix + 'alpha/' + params.conversation_id
    : Url.urlPrefix + params.conversation_id

  const constructEmbeddedOnMarkup = () => {
    return (
      <p data-testid="embed-page">
        {strings('dist_embedded_on')}
        <a style={{ color: 'black' }} target="blank" href={conversationData.parent_url}>
          {conversationData.parent_url}
        </a>
      </p>
    )
  }

  return (
    <div>
      <h3 className="mb-3 mb-xl-4" style={{ fontSize: '20px', lineHeight: 1.5 }}>
        {strings('dist_heading')}
      </h3>
      <ConversationHasCommentsCheck
        conversation_id={params.conversation_id}
        strict_moderation={conversationData.strict_moderation}
      />
      <div className="mb-3">
        <span className="d-block mb-2">
          {strings('dist_share')}
        </span>
        <span className="d-block mb-2">
          <a target="blank" href={participantUrl}>
            {participantUrl}
          </a>
        </span>
      </div>
      <div className="mb-5">
        <span className="d-block mb-2">
          {strings('dist_embed')}
        </span>
        <div>
          <pre>
            {'<div'}
            {" class='polis'"}
            {" data-conversation_id='" + params.conversation_id + "'>"}
            {'</div>\n'}
            {"<script async src='" + Url.urlPrefix + "embed.js'></script>"}
          </pre>
        </div>
        <span className="d-block mt-2" style={{ maxWidth: '35em' }}>
          {strings('dist_embed_note')}{' '}
          <Link to="/integrate">{strings('dist_integrate_link')}</Link>
        </span>
        <div>{conversationData.parent_url ? constructEmbeddedOnMarkup() : ''}</div>
      </div>

      <ParticipantXids conversation_id={params.conversation_id} />
    </div>
  )
}

export default ShareAndEmbed
