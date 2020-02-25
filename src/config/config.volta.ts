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
import * as uuid from "uuid"

export const config = {
    ocn: {
        node: "http://node.ocn.org",
        stage: "local"
    },
    cpo: {
        port: 3000,
        publicIP: "http://mock.cpo.com",
        roles: [
            {
                party_id: "CPO",
                country_code: "CH",
                role: "CPO",
                business_details: {
                    name: `Test CPO ${uuid.v4()}`
                }
            }
        ]
    },
    msp: {
        port: 3001,
        publicIP: "http://mock-msp.com",
        roles: [
            {
                party_id: "MSP",
                country_code: "CH",
                role: "EMSP",
                business_details: {
                    name: `Test MSP ${uuid.v4()}`
                }
            }
        ]
    }

}