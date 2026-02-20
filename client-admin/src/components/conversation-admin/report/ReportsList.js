// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { useAuth } from 'react-oidc-context'
import { useParams } from 'react-router'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { hasDelphiEnabled, isAdminOrMod, useUser } from '../../../util/auth'
import { useConversationData } from '../../../util/conversation_data'
import PolisNet from '../../../util/net'
import Url from '../../../util/url'
import strings from '../../../strings/strings'
import { getLocale } from '../../../strings/strings'

const getModText = (level) => {
  const l = String(level)
  if (l === '0') return strings('reports_mod_level_0')
  if (l === '-1') return strings('reports_mod_level_minus1')
  if (l === '-2') return strings('reports_mod_level_minus2')
  return ''
}

const formatTimestamp = (timestamp) => {
  const date = new Date(parseInt(timestamp))
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 60) {
    return strings('reports_minutes_ago', { count: diffMinutes })
  } else if (diffHours < 24) {
    return strings('reports_hours_ago', { count: diffHours })
  } else if (diffDays < 7) {
    return strings('reports_days_ago', { count: diffDays })
  } else {
    return date.toLocaleDateString(getLocale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const ReportLink = ({ title, href, urlPrefix }) => (
  <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-2 mb-md-1">
    <span className="text-polis-secondary mb-1 mb-md-0 me-0 me-md-2" style={{ fontSize: '14px' }}>
      {title}:
    </span>
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      style={{ fontSize: '12px' }}>
      {urlPrefix}
    </a>
  </div>
)

ReportLink.propTypes = {
  title: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  urlPrefix: PropTypes.string.isRequired
}

const ReportsList = () => {
  const params = useParams()
  const { isAuthenticated, user: authUser } = useAuth()
  const userContext = useUser()
  const conversationData = useConversationData()
  const [mod_level, setModLevel] = useState(-2)

  const [state, setState] = useState({
    loading: true,
    reports: [],
    dataLoaded: false
  })

  const [expandedReports, setExpandedReports] = useState(new Set())

  const getData = () => {
    const reportsPromise = PolisNet.polisGet('/api/v3/reports', {
      conversation_id: params.conversation_id
    })
    reportsPromise.then((reports) => {
      setState({
        loading: false,
        reports: reports,
        dataLoaded: true
      })
    })
  }

  useEffect(() => {
    if (!state.dataLoaded && isAdminOrMod(userContext, conversationData)) {
      getData()
    }
  }, [conversationData, isAuthenticated, userContext, state.dataLoaded])

  const createReportClicked = () => {
    PolisNet.polisPost('/api/v3/reports', {
      conversation_id: params.conversation_id,
      mod_level
    }).then(() => {
      getData()
    })
  }

  const toggleReportExpansion = (reportId) => {
    setExpandedReports((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(reportId)) {
        newSet.delete(reportId)
      } else {
        newSet.add(reportId)
      }
      return newSet
    })
  }

  if (state.loading) {
    return <div>{strings('reports_loading')}</div>
  }

  return (
    <div>
      <h3 className="mb-3 mb-xl-4" style={{ fontSize: '20px', lineHeight: 1.5 }}>
        {strings('reports_heading')}
      </h3>
      <div className="mb-3 mb-xl-4">
        {hasDelphiEnabled(authUser) && (
          <div>
            {strings('reports_select_comments')}
            <select
              defaultValue={-2}
              onChange={(e) => setModLevel(e.target.value)}
              style={{ display: 'block', margin: '1em 0' }}>
              <option value={-2}>{strings('reports_include_all')}</option>
              <option value={-1}>{strings('reports_include_no_rejected')}</option>
              <option value={0}>{strings('reports_include_accepted_only')}</option>
            </select>
          </div>
        )}
        <Button onClick={createReportClicked}>{strings('reports_create')}</Button>
      </div>
      {state.reports
        .sort((a, b) => parseInt(b.modified) - parseInt(a.modified))
        .map((report) => {
          const isExpanded = expandedReports.has(report.report_id)
          const handleCardClick = () => {
            toggleReportExpansion(report.report_id)
          }

          return (
            <div key={report.report_id} className="mb-3">
              <Card
                data-testid="report-list-item"
                className="polis-card"
                style={{ cursor: 'pointer' }}
                onClick={handleCardClick}>
                <Card.Body>
                  <div className="d-flex flex-column mb-2">
                    <span className="fw-bold mb-1" style={{ fontSize: '16px' }}>
                      {strings('reports_modified')} {formatTimestamp(report.modified)}
                    </span>
                    <span className="text-polis-secondary fst-italic" style={{ fontSize: '14px' }}>
                      {strings('reports_report_id')} {report.report_id}
                    </span>
                  </div>

                  {hasDelphiEnabled(authUser) && (
                    <div className="mt-2">
                      <span className="text-polis-secondary fst-italic" style={{ fontSize: '14px' }}>
                        {getModText(report.mod_level)}
                      </span>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {isExpanded && (
                <Card className="mt-2" style={{ overflowX: 'auto' }}>
                  <Card.Body>
                    <span className="fw-bold mb-2 d-block" style={{ fontSize: '14px' }}>
                      {strings('reports_urls')}
                    </span>
                    <ReportLink
                      title={strings('reports_standard')}
                      href={`${Url.reportUrlPrefix}report/${report.report_id}`}
                      urlPrefix={`${Url.reportUrlPrefix}report/${report.report_id}`}
                    />
                    <ReportLink
                      title={strings('reports_data_export')}
                      href={`${Url.reportUrlPrefix}exportReport/${report.report_id}`}
                      urlPrefix={`${Url.reportUrlPrefix}exportReport/${report.report_id}`}
                    />
                    {hasDelphiEnabled(authUser) ? (
                      <>
                        <ReportLink
                          title={strings('reports_topic')}
                          href={`${Url.reportUrlPrefix}topicReport/${report.report_id}`}
                          urlPrefix={`${Url.reportUrlPrefix}topicReport/${report.report_id}`}
                        />
                        <ReportLink
                          title={strings('reports_topics_viz')}
                          href={`${Url.reportUrlPrefix}topicsVizReport/${report.report_id}`}
                          urlPrefix={`${Url.reportUrlPrefix}topicsVizReport/${report.report_id}`}
                        />
                        <ReportLink
                          title={strings('reports_topic_stats')}
                          href={`${Url.reportUrlPrefix}topicStats/${report.report_id}`}
                          urlPrefix={`${Url.reportUrlPrefix}topicStats/${report.report_id}`}
                        />
                        <ReportLink
                          title={strings('reports_topic_map_narrative')}
                          href={`${Url.reportUrlPrefix}topicMapNarrativeReport/${report.report_id}`}
                          urlPrefix={`${Url.reportUrlPrefix}topicMapNarrativeReport/${report.report_id}`}
                        />
                      </>
                    ) : (
                      <ReportLink
                        title={strings('reports_analysis_insights')}
                        href="https://pro.pol.is/"
                        urlPrefix={strings('reports_delphi_promo')}
                      />
                    )}
                  </Card.Body>
                </Card>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default ReportsList
