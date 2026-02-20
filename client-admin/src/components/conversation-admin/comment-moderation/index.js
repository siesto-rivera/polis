// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Routes, Route, Link, useParams, useLocation } from 'react-router'
import { useAuth } from 'react-oidc-context'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { populateAllCommentStores } from '../../../actions'
import ModerateCommentsAccepted from './ModerateCommentsAccepted'
import ModerateCommentsRejected from './ModerateCommentsRejected'
import ModerateCommentsTodo from './ModerateCommentsTodo'
import strings from '../../../strings/strings'

const pollFrequency = 60000

const CommentModeration = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const location = useLocation()
  const { isLoading, isAuthenticated } = useAuth()
  const unmoderated = useSelector((state) => state.mod_comments_unmoderated)
  const accepted = useSelector((state) => state.mod_comments_accepted)
  const rejected = useSelector((state) => state.mod_comments_rejected)
  const getCommentsRepeatedlyRef = useRef(null)

  const [pageSize] = useState(50)
  const [currentPage, setCurrentPage] = useState(0)

  const loadComments = (page = currentPage) => {
    const offset = page * pageSize
    dispatch(populateAllCommentStores(params.conversation_id, pageSize, offset))
  }

  const handlePageChange = (newOffset, limit) => {
    const newPage = Math.floor(newOffset / limit)
    setCurrentPage(newPage)
    loadComments(newPage)
  }

  useEffect(() => {
    if (params.conversation_id && !isLoading && isAuthenticated) {
      loadComments()

      if (!getCommentsRepeatedlyRef.current) {
        getCommentsRepeatedlyRef.current = setInterval(() => {
          loadComments()
        }, pollFrequency)
      }
    }

    return () => {
      if (getCommentsRepeatedlyRef.current) {
        clearInterval(getCommentsRepeatedlyRef.current)
        getCommentsRepeatedlyRef.current = null
      }
    }
  }, [params.conversation_id, isLoading, isAuthenticated])

  const url = location.pathname.split('/')[4]

  return (
    <div>
      <h3 className="mb-3 mb-xl-4" style={{ fontSize: '20px', lineHeight: 1.5 }}>
        {strings('mod_heading')}
      </h3>
      <div className="d-flex mb-4" style={{ gap: '16px' }}>
        <Link
          data-testid="mod-queue"
          className={url ? 'polis-nav-link' : 'polis-nav-link-active'}
          to="../comments">
          {strings('mod_unmoderated')}{' '}
          {unmoderated.pagination?.total !== undefined
            ? unmoderated.pagination.total
            : Array.isArray(unmoderated.unmoderated_comments)
              ? unmoderated.unmoderated_comments.length
              : null}
        </Link>
        <Link
          data-testid="filter-approved"
          className={url === 'accepted' ? 'polis-nav-link-active' : 'polis-nav-link'}
          to="../comments/accepted">
          {strings('mod_accepted')}{' '}
          {accepted.pagination?.total !== undefined
            ? accepted.pagination.total
            : Array.isArray(accepted.accepted_comments)
              ? accepted.accepted_comments.length
              : null}
        </Link>
        <Link
          data-testid="filter-rejected"
          className={url === 'rejected' ? 'polis-nav-link-active' : 'polis-nav-link'}
          to="../comments/rejected">
          {strings('mod_rejected')}{' '}
          {rejected.pagination?.total !== undefined
            ? rejected.pagination.total
            : Array.isArray(rejected.rejected_comments)
              ? rejected.rejected_comments.length
              : null}
        </Link>
      </div>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <ModerateCommentsTodo
                pagination={unmoderated.pagination}
                onPageChange={handlePageChange}
                loading={unmoderated.loading}
              />
            }
          />
          <Route
            path="accepted"
            element={
              <ModerateCommentsAccepted
                pagination={accepted.pagination}
                onPageChange={handlePageChange}
                loading={accepted.loading}
              />
            }
          />
          <Route
            path="rejected"
            element={
              <ModerateCommentsRejected
                pagination={rejected.pagination}
                onPageChange={handlePageChange}
                loading={rejected.loading}
              />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default CommentModeration
