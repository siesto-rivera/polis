import PropTypes from 'prop-types'
import emoji from 'react-easy-emoji'

const KnowledgeBase = ({ e, url, txt }) => {
  return (
    <div className="my-3">
      <a target="_blank" href={url} rel="noreferrer">
        <span style={{ marginRight: 12 }}>{emoji(e)}</span>
        {txt}
      </a>
    </div>
  )
}

KnowledgeBase.propTypes = {
  e: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  txt: PropTypes.string.isRequired
}

export default KnowledgeBase
