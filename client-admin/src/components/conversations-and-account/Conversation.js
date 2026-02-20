import Card from 'react-bootstrap/Card'
import PropTypes from 'prop-types'
import strings from '../../strings/strings'

function Conversation({ c, i, goToConversation }) {
  return (
    <Card
      onClick={goToConversation}
      className="mb-3 polis-card"
      style={{ cursor: 'pointer', overflowWrap: 'break-word' }}
      key={i}>
      <Card.Body>
        <span className="fw-bold mb-2">{c.topic}</span>
        {c.description && <span> {c.description}</span>}
        {c.parent_url && (
          <span data-testid="embed-page">
            {' '}
            {strings('convos_embedded_on', { url: c.parent_url })}
          </span>
        )}
        <span className="ms-2 text-polis-secondary" style={{ fontSize: '14px' }}>
          {' '}
          {strings('convos_participants_count', { count: c.participant_count })}
        </span>
      </Card.Body>
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
