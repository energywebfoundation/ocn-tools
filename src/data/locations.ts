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

import { IEnergyMix, ILocation } from "@shareandcharge/ocn-bridge/dist/models/ocpi/locations";
import { config } from "../config/config";
import { extractCPO } from "../tools/tools";

export const locations: ILocation[] = []

let i: number

for (i = 1; i <= 10; i++) {

    const cpo = extractCPO(config.cpo.roles)

    let tariffID: string
    let eneryMix: IEnergyMix
   
    switch (true) {
        case (i < 5):
            tariffID = "1"
            break
        case (i < 8):
            tariffID = "2"
            break
        default:
            tariffID = "3"
    }

    eneryMix = {
        is_green_energy: true,
        supplier_name: "Utility 2",
        energy_product_name: "Product green"
    }

    if (i < 5) {
        eneryMix = {
            is_green_energy: false,
            energy_sources: [ 
                { 
                    source: "WATER", 
                    percentage: 55.4 
                },
                {   source: "NUCLEAR",
                    percentage: 36.1 
                },
                { 
                    source: "GENERAL_FOSSIL",
                    percentage: 2.8 
                },
                {  
                    source: "GENERAL_GREEN", 
                    "percentage": 5.7 
                },
            ],
            environ_impact: [
                { 
                    category: "NUCLEAR_WASTE", 
                    amount: 0.0006
                },
                {  
                    category: "CARBON_DIOXIDE", 
                    amount: 298
                }
            ],
            supplier_name: "Utility 1",
            energy_product_name: "Product gray"
        }
    }
    
    locations.push({
        country_code: cpo.country_code,
        party_id: cpo.party_id,
        id: `Loc${i}`,
        name: `Station ${i}`,
        publish: true,
        address: `Test-Street ${i}`,
        city: "Zug",
        postal_code: "6300",
        country: "CHE",
        coordinates: {
            latitude: `47.1${78 + i}`,
            longitude: "8.518",
        },
        operator: {
            name: cpo.business_details.name
        },
        opening_times: {
            twentyfourseven: false,
            regular_hours: [1, 2, 3, 4, 5, 6, 7].map((n) => {
                return {
                    weekday: n,
                    period_begin: "06:00",
                    period_end: "24:00"
                }
            })
        },
        evses: [
            {
                uid: `CH-CPO-S${i}E100001`,
                evse_id: `CH-CPO-S${i}E100001`,
                status: "AVAILABLE",
                connectors: [{
                    id: `S${i}E1Con1`,
                    standard: "IEC_62196_T2",
                    format: "SOCKET",
                    power_type: "AC_3_PHASE",
                    max_voltage: 220,
                    max_amperage: 16,
                    tariff_ids: [tariffID],
                    last_updated: "2019-10-14T12:02:45.006Z"
                }],
                last_updated: "2019-10-14T12:02:45.006Z"
            },
            {
                uid: `CH-CPO-S${i}E100002`,
                evse_id: `CH-CPO-S${i}E100002`,
                status: "AVAILABLE",
                connectors: [{
                    id: `S${i}E1Con2`,
                    standard: "IEC_62196_T2",
                    format: "SOCKET",
                    power_type: "AC_3_PHASE",
                    max_voltage: 220,
                    max_amperage: 16,
                    tariff_ids: [tariffID],
                    last_updated: "2019-10-14T12:02:45.006Z"
                }],
                last_updated: "2019-10-14T12:02:45.006Z"
            }
        ],
        energy_mix: eneryMix,
        last_updated: "2019-10-14T12:02:45.006Z"
    })
}
