import { IChargeDetailRecord } from "ocn-bridge/dist/models/ocpi/cdrs";
import { config } from "../config/config";
import { extractCPO } from "../tools/tools";

const cpo = extractCPO(config.cpo.roles)

export const cdrs: IChargeDetailRecord[] = [
    {
        country_code: cpo.country_code,
        party_id: cpo.party_id,
        id: "12345",
        auth_method: "COMMAND",
        start_date_time: new Date(1571216038071).toISOString(),
        end_date_time: new Date(1571216086027).toISOString(),
        cdr_token: {
            uid: "012345678",
            type: "APP_USER",
            contract_id: "DE-EMY-CJYW58YUJ-X"
        },
        cdr_location: {
            id: "LOC1",
            address: "Ruettenscheider Str. 120",
            city: "Essen",
            postal_code: "45131",
            country: "DE",
            coordinates: {
                latitude: "3.729944",
                longitude: "51.047599"
            },
            evse_uid: "BB-5983-3",
            evse_id: "BB-5983-3",
            connector_id: "1",
            connector_standard: "IEC_62196_T2",
            connector_format: "SOCKET",
            connector_power_type: "AC_1_PHASE"
        },
        currency: "EUR",
        charging_periods: [{
            start_date_time:  new Date(1571216038071).toISOString(),
            dimensions: [{
                "type": "TIME",
                "volume": 1.973
            }],
            tariff_id: "1"
        }],
        total_cost: {
            "excl_vat": 0.45,
            "incl_vat": 0.00
        },
        total_energy: 0.7,
        total_time: 0.016729166666666666,
        last_updated: new Date().toISOString()
    }
]
