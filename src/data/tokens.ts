/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { IToken } from "@energyweb/ocn-bridge"
import { bool, integer, MersenneTwister19937 } from "random-js"
import { config } from "../config/config"
import { extractMSP } from "../tools/tools"

const msp = extractMSP(config.msp.roles)

const mt = MersenneTwister19937.seed(3)

export const tokens: IToken[] = []

for (let i = 1; i <= config.msp.assetCount; i++) {
    const max = 99999999
    const randomInt = integer(0, max)(mt)
    const uid = ("111111" + randomInt).slice(-8) // Ensure that uid is 8 digits

    // Sample VIN prefixes for Mercedes-Benz
    // https://www.lastvin.com/de/
    const manufacturerID = (() => {
        switch (randomInt % 3) {
            case 0:
                return "VSA"
            case 1:
                return "WDD"
            case 2:
            default:
                return "WDB"
        }
    })()

    tokens.push({
        country_code: msp.country_code,
        party_id: msp.party_id,
        uid,
        type: bool()(mt) ? "APP_USER" : "RFID",
        contract_id: `${msp.country_code}-${msp.party_id}-${manufacturerID}${uid}`,
        issuer: msp.business_details.name,
        whitelist: "NEVER",
        valid: true,
        last_updated: new Date().toISOString()
    })
}
