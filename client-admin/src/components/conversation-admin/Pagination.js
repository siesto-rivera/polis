import { Box, Button, Text } from 'theme-ui'
import PropTypes from 'prop-types'
import strings from '../../strings/strings'

const Pagination = ({ pagination, onPageChange, loading = false }) => {
  if (!pagination || pagination.total === 0) {
    return null
  }

  const { limit, offset, total, hasMore } = pagination
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  const handlePrevious = () => {
    if (offset > 0) {
      const newOffset = Math.max(0, offset - limit)
      onPageChange(newOffset, limit)
    }
  }

  const handleNext = () => {
    if (hasMore) {
      const newOffset = offset + limit
      onPageChange(newOffset, limit)
    }
  }

  const handleFirst = () => {
    if (offset > 0) {
      onPageChange(0, limit)
    }
  }

  const handleLast = () => {
    if (hasMore) {
      const lastOffset = Math.floor((total - 1) / limit) * limit
      onPageChange(lastOffset, limit)
    }
  }

  const startItem = offset + 1
  const endItem = Math.min(offset + limit, total)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: ['column', 'row'],
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: [3, 0],
        mt: [3],
        pt: [3],
        borderTop: '1px solid',
        borderColor: 'lightGray'
      }}>
      <Text sx={{ fontSize: [1], mb: [3, 0] }}>
        {strings('pagination_showing', { start: startItem, end: endItem, total })}
      </Text>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: [2]
        }}>
        <Button
          variant="outline"
          size="small"
          onClick={handleFirst}
          disabled={offset === 0 || loading}
          sx={{
            fontSize: [0],
            px: [2],
            py: [1],
            '&:disabled': {
              backgroundColor: 'lightGray',
              borderColor: 'mediumGray',
              color: 'gray',
              cursor: 'not-allowed'
            }
          }}>
          {strings('pagination_first')}
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={handlePrevious}
          disabled={offset === 0 || loading}
          sx={{
            fontSize: [0],
            px: [2],
            py: [1],
            '&:disabled': {
              backgroundColor: 'lightGray',
              borderColor: 'mediumGray',
              color: 'gray',
              cursor: 'not-allowed'
            }
          }}>
          {strings('pagination_previous')}
        </Button>

        <Text sx={{ fontSize: [1], mx: [2] }}>
          {strings('pagination_page', { current: currentPage, totalPages })}
        </Text>

        <Button
          variant="outline"
          size="small"
          onClick={handleNext}
          disabled={!hasMore || loading}
          sx={{
            fontSize: [0],
            px: [2],
            py: [1],
            '&:disabled': {
              backgroundColor: 'lightGray',
              borderColor: 'mediumGray',
              color: 'gray',
              cursor: 'not-allowed'
            }
          }}>
          {strings('pagination_next')}
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={handleLast}
          disabled={!hasMore || loading}
          sx={{
            fontSize: [0],
            px: [2],
            py: [1],
            '&:disabled': {
              backgroundColor: 'lightGray',
              borderColor: 'mediumGray',
              color: 'gray',
              cursor: 'not-allowed'
            }
          }}>
          {strings('pagination_last')}
        </Button>
      </Box>
    </Box>
  )
}

Pagination.propTypes = {
  pagination: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    hasMore: PropTypes.bool.isRequired
  }),
  onPageChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  pageSize: PropTypes.number
}

export default Pagination
