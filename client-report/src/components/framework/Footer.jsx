// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";
import LargeLogo from "./logoLargeShort.jsx";

const Footer = (/*{conversation}*/) => {
 return (
   <div style={{
       display: "flex",
       flexDirection: "column",
       alignItems: "center",
       marginTop: 40,
       marginBottom: 60,
       gap: 12,
     }}>
     <LargeLogo/>
     <a
       href="https://github.com/siesto-rivera/polis"
       target="_blank"
       rel="noopener noreferrer"
       style={{ fontSize: 12, color: "#999", textDecoration: "none" }}>
       Source Code (AGPL-3.0)
     </a>
   </div>
 )
};

export default Footer;
