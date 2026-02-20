// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import Url from '../../util/url'
import { useUser } from '../../util/auth'

const Integrate = () => {
  const userContext = useUser()
  const userSiteId =
    userContext?.user === null ? '__loading, try refreshing__' : userContext?.user?.site_ids?.[0]

  const snippet = `
    <div
      class="polis"
      data-page_id="PAGE_ID"
      data-site_id="${userSiteId}">
    </div>
    <script async src="${Url.urlPrefix}embed.js"></script>
  `

  return (
    <div>
      <div>
        <h3 className="mb-3 mb-xl-4" style={{ fontSize: '20px', lineHeight: 1.5 }}>
          Integrate
        </h3>
        <span>
          Copy and paste this code into your content management template. Each page (article, post)
          requires a unique string in the &quot;PAGE_ID&quot; field. This should be consistent over
          time and unique to each of your pages (like the article title).
        </span>
        <ul>
          <li>
            When this embed code loads on your website, it will either create a new conversation (if
            one is not already associated with the string passed into PAGE_ID) or load an existing
            conversation.
          </li>
          <li>
            This embed code will keep track of what conversations belongs on what pages via the
            data-page_id HTML attribute.
          </li>
          <li>
            Simply replace &quot;PAGE_ID&quot;, either manually or in your templates, to create new
            conversations and load existing ones in the right place.
          </li>
        </ul>
        <div>
          <pre>{snippet}</pre>
        </div>
      </div>
    </div>
  )
}

export default Integrate
