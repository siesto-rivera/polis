// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import en_us from './en_us'
import ko from './ko'

let s = {}

// Language detection
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
const uiLang = params ? params.get('ui_lang') : null
const browserLang = typeof navigator !== 'undefined' ? (navigator.language || '') : ''

if (uiLang === 'ko' || (!uiLang && browserLang.match(/^ko/))) {
  s = { ...en_us, ...ko }
} else {
  s = en_us
}

function f(key, vars) {
  // strip whitespace from key
  key = key.replace(/\s+$/, '').replace(/^\s+/, '')
  let val = typeof s[key] === 'undefined' ? key : s[key]
  if (vars && typeof val === 'string') {
    Object.keys(vars).forEach((k) => {
      val = val.replace(new RegExp('\\{\\{' + k + '\\}\\}', 'g'), vars[k])
    })
  }
  return val
}

export function getLocale() {
  if (uiLang === 'ko' || (!uiLang && browserLang.match(/^ko/))) {
    return 'ko-KR'
  }
  return 'en-US'
}

export default f
