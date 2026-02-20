// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { VictoryChart, VictoryArea } from 'victory'
import victoryTheme from './victoryTheme'
import colors from '../../../theme/colors'
import PropTypes from 'prop-types'
import strings from '../../../strings/strings'

const Commenters = ({ size, firstCommentTimes }) => {
  if (firstCommentTimes.length <= 1) return null
  return (
    <div className="mt-5">
      <h6 className="my-2" style={{ fontSize: '16px', lineHeight: 1.5 }}>
        {strings('stats_commenters_over_time')}
      </h6>
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <VictoryChart
          theme={victoryTheme}
          height={size}
          width={size}
          domainPadding={{ x: 0, y: [0, 20] }}
          scale={{ x: 'time' }}>
          <VictoryArea
            style={{ data: { fill: colors.primary } }}
            data={firstCommentTimes.map((d, i) => {
              return { x: new Date(d), y: i }
            })}
          />
        </VictoryChart>
      </div>
    </div>
  )
}

Commenters.propTypes = {
  size: PropTypes.number.isRequired,
  firstCommentTimes: PropTypes.array.isRequired
}

export default Commenters
