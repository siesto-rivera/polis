// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { useRef } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import strings from '../../../strings/strings'

const Comment = ({
  comment,
  acceptClickHandler,
  rejectClickHandler,
  toggleIsMetaHandler,
  acceptButton,
  acceptButtonText,
  rejectButton,
  rejectButtonText,
  isMetaCheckbox
}) => {
  const isMetaRef = useRef(null)

  const onAcceptClicked = () => {
    acceptClickHandler(comment)
  }

  const onRejectClicked = () => {
    rejectClickHandler(comment)
  }

  const onIsMetaClicked = async () => {
    toggleIsMetaHandler(comment, isMetaRef.current.checked)
  }

  return (
    <Card className="mb-3 polis-card" style={{ minWidth: '35em' }} data-testid="pending-comment">
      <Card.Body>
        <span className="mb-3 d-block" style={{ color: '#f06273', fontSize: 12 }}>
          {comment.active
            ? null
            : strings('mod_flag_warning')}
        </span>
        <span className="mb-3 d-block">{comment.txt}</span>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div>
            {acceptButton ? (
              <Button variant="success" className="me-3" onClick={onAcceptClicked}>
                {acceptButtonText}
              </Button>
            ) : null}
            {rejectButton ? (
              <Button variant="danger" onClick={onRejectClicked} data-testid="reject-comment">
                {rejectButtonText}
              </Button>
            ) : null}
          </div>
          <div className="d-flex align-items-center">
            <a target="_blank" className="me-2" href="https://compdemocracy.org/metadata" rel="noreferrer">
              {isMetaCheckbox ? strings('mod_metadata') : null}
            </a>
            {isMetaCheckbox ? (
              <input
                type="checkbox"
                label="metadata"
                ref={isMetaRef}
                checked={comment.is_meta}
                onChange={onIsMetaClicked}
              />
            ) : null}
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

Comment.propTypes = {
  acceptClickHandler: PropTypes.func,
  rejectClickHandler: PropTypes.func,
  toggleIsMetaHandler: PropTypes.func,
  acceptButton: PropTypes.bool,
  acceptButtonText: PropTypes.string,
  rejectButton: PropTypes.bool,
  rejectButtonText: PropTypes.string,
  isMetaCheckbox: PropTypes.bool,
  comment: PropTypes.shape({
    active: PropTypes.bool,
    txt: PropTypes.string,
    is_meta: PropTypes.bool
  })
}

export default Comment
