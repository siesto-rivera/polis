import { useDispatch } from 'react-redux'
import { useState } from 'react'
import PropTypes from 'prop-types'

import { handleConversationDataUpdate } from '../../actions'
import { useConversationData } from '../../util/conversation_data'

export const CheckboxField = ({ field, label = '', children, isIntegerBool = false }) => {
  const conversationData = useConversationData()
  const initialState = isIntegerBool
    ? Number(conversationData[field]) === 1
      ? 1
      : 0
    : Boolean(conversationData[field])
  const [state, setState] = useState(initialState)
  const dispatch = useDispatch()

  const handleBoolValueChange = (field) => {
    const val = !state
    setState(val)
    dispatch(handleConversationDataUpdate(conversationData, field, val))
  }

  const transformBoolToInt = (value) => {
    return value ? 1 : 0
  }

  const handleIntegerBoolValueChange = (field) => {
    const val = transformBoolToInt(!state)
    setState(val)
    dispatch(handleConversationDataUpdate(conversationData, field, val))
  }

  return (
    <div className="d-flex align-items-start mb-3">
      <div className="flex-shrink-0" style={{ position: 'relative', top: -0.5 }}>
        <input
          type="checkbox"
          label={label}
          data-testid={field}
          checked={
            isIntegerBool ? Number(conversationData[field]) === 1 : Boolean(conversationData[field])
          }
          onChange={
            isIntegerBool
              ? () => handleIntegerBoolValueChange(field)
              : () => handleBoolValueChange(field)
          }
        />
      </div>
      <div
        className="ms-2"
        style={{
          flex: '1 1 auto',
          maxWidth: '35em',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}>
        <span>{children}</span>
      </div>
    </div>
  )
}
CheckboxField.propTypes = {
  field: PropTypes.string.isRequired,
  label: PropTypes.string,
  children: PropTypes.string.isRequired,
  isIntegerBool: PropTypes.bool
}
