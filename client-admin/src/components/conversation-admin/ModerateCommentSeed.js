// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import Button from 'react-bootstrap/Button'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useRef } from 'react'
import PropTypes from 'prop-types'

import strings from '../../strings/strings'
import {
  handleBulkSeedCommentSubmit,
  handleSeedCommentSubmit,
  seedCommentChanged
} from '../../actions'

const textareaStyle = {
  fontFamily: "'Space Mono', monospace",
  fontSize: '16px',
  width: '100%',
  maxWidth: '35em',
  height: '7em',
  resize: 'none',
  padding: '8px',
  borderRadius: 2,
  border: '1px solid #60656f'
}

const ModerateCommentsSeed = ({ params }) => {
  const dispatch = useDispatch()
  const { seedText, loading, success, error } = useSelector((state) => state.seed_comments)

  const [csvText, setCsvText] = useState(undefined)
  const seedFormRef = useRef(null)

  const handleSubmitSeed = () => {
    const comment = {
      txt: seedFormRef.current.value,
      conversation_id: params.conversation_id,
      is_seed: true
    }
    dispatch(handleSeedCommentSubmit(comment))
  }

  const handleSubmitSeedBulk = () => {
    dispatch(
      handleBulkSeedCommentSubmit(
        {
          csv: csvText,
          conversation_id: params.conversation_id,
          is_seed: true
        },
        params.setOnComplete
      )
    )
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      setCsvText(text)
    }
    reader.readAsText(file)
  }

  const handleTextareaChange = (e) => {
    dispatch(seedCommentChanged(e.target.value))
  }

  const getButtonText = () => {
    let text = strings('seed_submit')

    if (success) {
      text = strings('seed_success')
    }

    if (loading) {
      text = strings('seed_saving')
    }

    return text
  }

  return (
    <div className="mb-4">
      {params.uploadOnly ? null : (
        <>
          <span className="mb-2 d-block">
            {strings('seed_add')}{' '}
            <a target="_blank" href="https://compdemocracy.org/seed-comments" rel="noreferrer">
              {strings('seed_link_text')}
            </a>{' '}{strings('seed_for_participants')}
          </span>
          <div className="mb-2">
            <textarea
              style={textareaStyle}
              onChange={handleTextareaChange}
              maxLength="400"
              data-testid="seed_form"
              value={seedText}
              ref={seedFormRef}
            />
          </div>
          <div>
            <Button onClick={handleSubmitSeed}>{getButtonText()}</Button>
            {error ? <span>{strings(error)}</span> : null}
          </div>
        </>
      )}
      <div className="mt-2 d-block">
        <h6 className="my-3 my-xl-4" style={{ fontSize: '14px', lineHeight: 1.5 }}>
          {strings('seed_upload_csv_heading')}
        </h6>
        {params.uploadOnly ? (
          <>
            {strings('seed_csv_format')}
            <pre>
              <code>
                comment_text,original_id
                <br />
                This is sample comment one,550e8400-e29b-41d4-a716-446655440000
                <br />
                This is sample comment two,550e8400-e29b-41d4-a716-446655440000
              </code>
            </pre>
            {strings('seed_original_id_note')}
          </>
        ) : (
          <>
            {strings('seed_csv_format')}
            <pre>
              <code>
                comment_text
                <br />
                This is sample comment one
                <br />
                This is sample comment two
              </code>
            </pre>
          </>
        )}
        <div className="mt-2 d-block">
          <input onChange={handleFileChange} type="file" id="csvFile" accept=".csv"></input>
          <Button
            disabled={loading || !csvText}
            onClick={handleSubmitSeedBulk}
            data-testid="upload-csv-button">
            {getButtonText()}
          </Button>
          {error ? <span>{strings(error)}</span> : null}
        </div>
      </div>
    </div>
  )
}

ModerateCommentsSeed.propTypes = {
  params: PropTypes.shape({
    conversation_id: PropTypes.string.isRequired,
    uploadOnly: PropTypes.bool,
    setOnComplete: PropTypes.func
  }).isRequired
}

export default ModerateCommentsSeed
