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

import { evseStatus, IEnergyMix, ILocation } from "@energyweb/ocn-bridge";
import { config } from "../config/config";
import { extractCPO } from "../tools/tools";

export const locations: ILocation[] = []

const statusOptions = ["AVAILABLE", "CHARGING"] as evseStatus[]
const guessAvailability = (): evseStatus => statusOptions[Math.round(Math.random())]
const cpo = extractCPO(config.cpo.roles)

// https://openchargemap.org/site/poi/details/38434
const berlinChargePoint1 = createLocation(
    13,
    'Friedrich-List-Ufer',
    'Friedrich-List-Ufer',
    'Berlin',
    'DEU',
    '10557',
    52.525956,
    13.370633,
    400,
    16
)
locations.push(berlinChargePoint1)

// https://openchargemap.org/site/poi/details/38446
const berlinChargePoint2 = createLocation(
    14,
    'Scharnhorststrasse 34-37',
    'Scharnhorststrasse 34-37',
    'Berlin',
    'DEU',
    '10115',
    52.529722,
    13.373889,
    400,
    32
)
locations.push(berlinChargePoint2)

// https://openchargemap.org/site/poi/details/7655
const belgiumChargePoint1 = createLocation(
    15,
    'Interparking Sablon-Poelaert',
    'Place Poelaert',
    'Brussels',
    'BEL',
    '1000',
    50.8373217,
    4.35258410,
    400,
    16
)
locations.push(belgiumChargePoint1)

// https://openchargemap.org/site/poi/details/7654
const belgiumChargePoint2 = createLocation(
    16,
    'Interparking Grand Place',
    'rue Marche aux Herbes 104',
    'Brussels',
    'BEL',
    '1000',
    50.8466448,
    4.35543150,
    400,
    32
)
locations.push(belgiumChargePoint2)

//for (let i = 1; i <= 250; i++) {
function createLocation(
    i: number,
    name: string,
    address: string,
    city: string,
    country: string,
    postalCode: string,
    latitude: number,
    longitude: number,
    voltage: number,
    amperage: number
): ILocation {
    let tariffID: string
    let energyMix: IEnergyMix

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

    energyMix = {
        is_green_energy: true,
        supplier_name: "Utility 2",
        energy_product_name: "Product green"
    }

    if (i % 5 == 0) {
        energyMix = {
            is_green_energy: false,
            energy_sources: [
                {
                    source: "WATER",
                    percentage: 55.4
                },
                {
                    source: "NUCLEAR",
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
                    amount: 0.006
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

    return {
        country_code: cpo.country_code,
        party_id: cpo.party_id,
        id: `Loc${i}`,
        publish: true,
        name: `Station ${name}`,
        address: `${address}`,
        city: `${city}`,
        postal_code: `${postalCode}`,
        country: `${country}`,
        coordinates: {
            // latitude: `${(latitude + (Math.random() / 50)).toFixed(3)}`,
            // longitude: `${(longitude + (Math.random() / 50)).toFixed(3)}`,
            latitude: `${latitude}`,
            longitude: `${longitude}`,
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
                status: guessAvailability(),
                connectors: [{
                    id: `S${i}E1Con1`,
                    standard: "IEC_62196_T2",
                    format: "SOCKET",
                    power_type: "AC_3_PHASE",
                    max_voltage: voltage,
                    max_amperage: amperage,
                    tariff_ids: [tariffID],
                    last_updated: "2019-10-14T12:02:45.006Z"
                }],
                last_updated: "2019-10-14T12:02:45.006Z"
            },
            {
                uid: `CH-CPO-S${i}E100002`,
                evse_id: `CH-CPO-S${i}E100002`,
                status: guessAvailability(),
                connectors: [{
                    id: `S${i}E1Con2`,
                    standard: "IEC_62196_T2",
                    format: "SOCKET",
                    power_type: "AC_3_PHASE",
                    max_voltage: voltage,
                    max_amperage: amperage,
                    tariff_ids: [tariffID],
                    last_updated: "2019-10-14T12:02:45.006Z"
                }],
                last_updated: "2019-10-14T12:02:45.006Z"
            }
        ],
        time_zone: "Europe/Berlin",
        energy_mix: energyMix,
        last_updated: "2019-10-14T12:02:45.006Z"
    }
}
