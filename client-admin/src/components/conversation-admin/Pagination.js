import Button from 'react-bootstrap/Button'
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
    <div
      className="d-flex flex-column flex-md-row align-items-center justify-content-between mt-3 pt-3"
      style={{ borderTop: '1px solid #9ca3af' }}>
      <span className="mb-3 mb-md-0" style={{ fontSize: '14px' }}>
        {strings('pagination_showing', { start: startItem, end: endItem, total })}
      </span>

      <div className="d-flex align-items-center flex-wrap justify-content-center" style={{ gap: '8px' }}>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleFirst}
          disabled={offset === 0 || loading}>
          {strings('pagination_first')}
        </Button>

        <Button
          variant="outline-primary"
          size="sm"
          onClick={handlePrevious}
          disabled={offset === 0 || loading}>
          {strings('pagination_previous')}
        </Button>

        <span className="mx-2" style={{ fontSize: '14px' }}>
          {strings('pagination_page', { current: currentPage, totalPages })}
        </span>

        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleNext}
          disabled={!hasMore || loading}>
          {strings('pagination_next')}
        </Button>

        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleLast}
          disabled={!hasMore || loading}>
          {strings('pagination_last')}
        </Button>
      </div>
    </div>
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
