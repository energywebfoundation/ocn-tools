import { ILocation } from "ocn-bridge/dist/models/ocpi/locations";
import { config } from "../config/config";
import { extractCPO } from "../tools/tools";

export const locations: ILocation[] = []

let i: number

for (i = 1; i <= 10; i++) {

    const cpo = extractCPO(config.cpo.roles)

    locations.push({
        country_code: cpo.country_code,
        party_id: cpo.party_id,
        id: `Loc${i}`,
        name: `Station ${i}`,
        type: "OTHER",
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
                    last_updated: "2019-10-14T12:02:45.006Z"
                }],
                last_updated: "2019-10-14T12:02:45.006Z"
            }
        ],
        last_updated: "2019-10-14T12:02:45.006Z"
    })
}
