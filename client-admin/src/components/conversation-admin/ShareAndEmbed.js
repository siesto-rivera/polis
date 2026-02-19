// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Heading, Text, Box } from 'theme-ui'
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
      <Heading
        as="h3"
        sx={{
          fontSize: [3, null, 4],
          lineHeight: 'body',
          mb: [3, null, 4]
        }}>
        {strings('dist_heading')}
      </Heading>
      <ConversationHasCommentsCheck
        conversation_id={params.conversation_id}
        strict_moderation={conversationData.strict_moderation}
      />
      <Box sx={{ mb: [3] }}>
        <Text
          sx={{
            display: 'block',
            mb: [2]
          }}>
          {strings('dist_share')}
        </Text>
        <Text
          sx={{
            display: 'block',
            mb: [2]
          }}>
          <a target="blank" href={participantUrl}>
            {participantUrl}
          </a>
        </Text>
      </Box>
      <Box sx={{ mb: [5] }}>
        <Text
          sx={{
            display: 'block',
            mb: [2]
          }}>
          {strings('dist_embed')}
        </Text>
        <div>
          <pre>
            {'<div'}
            {" class='polis'"}
            {" data-conversation_id='" + params.conversation_id + "'>"}
            {'</div>\n'}
            {"<script async src='" + Url.urlPrefix + "embed.js'></script>"}
          </pre>
        </div>
        <Text
          sx={{
            display: 'block',
            maxWidth: ['100%', '100%', '35em'],
            mt: [2]
          }}>
          {strings('dist_embed_note')}{' '}
          <Link to="/integrate">{strings('dist_integrate_link')}</Link>
        </Text>
        <div>{conversationData.parent_url ? constructEmbeddedOnMarkup() : ''}</div>
      </Box>

      <ParticipantXids conversation_id={params.conversation_id} />
    </div>
  )
}

export default ShareAndEmbed
