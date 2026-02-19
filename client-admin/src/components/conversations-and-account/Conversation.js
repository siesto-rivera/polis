import { Text, Card } from 'theme-ui'
import PropTypes from 'prop-types'
import strings from '../../strings/strings'

function Conversation({ c, i, goToConversation }) {
  return (
    <Card
      onClick={goToConversation}
      sx={{ cursor: 'pointer', overflowWrap: 'break-word', mb: [3] }}
      key={i}>
      <Text as="span" sx={{ fontWeight: 700, mb: [2] }}>
        {c.topic}
      </Text>
      {c.description && <Text as="span"> {c.description}</Text>}
      {c.parent_url && (
        <Text as="span" data-testid="embed-page">
          {' '}
          {strings('convos_embedded_on', { url: c.parent_url })}
        </Text>
      )}
      <Text as="span" sx={{ ml: [2], color: 'textSecondary', fontSize: [1] }}>
        {' '}
        {strings('convos_participants_count', { count: c.participant_count })}
      </Text>
    </Card>
  )
}

Conversation.propTypes = {
  c: PropTypes.shape({
    topic: PropTypes.string,
    description: PropTypes.string,
    parent_url: PropTypes.string,
    participant_count: PropTypes.number
  }),
  i: PropTypes.number.isRequired,
  goToConversation: PropTypes.func.isRequired
}

export default Conversation
