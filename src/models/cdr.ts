import { ICdrLocation, IChargeDetailRecord } from "ocn-bridge/dist/models/ocpi/cdrs";
import { authMethod, ICdrToken, IChargingPeriod, IPrice } from "ocn-bridge/dist/models/ocpi/session";
import { ITariff } from "ocn-bridge/dist/models/ocpi/tariffs";
import { IStartSession } from "ocn-bridge/dist/models/pluggableAPI";
import * as uuid from "uuid";
import { config } from "../config/config";
import { extractCPO } from "../tools/tools";

export class Cdr implements IChargeDetailRecord {

    public country_code: string
    public party_id: string
    public id: string = uuid.v4()
    public start_date_time: string
    public end_date_time: string
    public session_id?: string
    public cdr_token: ICdrToken
    public auth_method: authMethod = "COMMAND"
    // public authorization_reference?: string
    public cdr_location: ICdrLocation
    // public meter_id?: string
    public currency: string
    public tariffs?: ITariff[]
    public charging_periods: IChargingPeriod[]
    // public signed_data?: ISignedData
    public total_cost: IPrice
    // public total_fixed_cost?: IPrice
    public total_energy: number
    public total_energy_cost?: IPrice
    public total_time: number
    // public total_time_cost?: IPrice
    // public total_parking_time?: number
    // public total_parking_cost?: IPrice
    // public total_reservation_cost?: IPrice
    // public remark?: string
    // public invoice_reference_id?: string
    // public credit?: boolean
    // public credit_reference_id?: string
    public last_updated: string

    constructor(sessionID: string, start: Date, kwh: number, request: IStartSession) {
        const cpo = extractCPO(config.cpo.roles)
        this.country_code = cpo.country_code
        this.party_id = cpo.party_id

        this.session_id = sessionID
        this.start_date_time = start.toISOString()
        this.end_date_time = new Date().toISOString()
        const duration = this.calculateTotalTime(start)
        this.cdr_token = {
            uid: request.token.uid,
            contract_id: request.token.contract_id,
            type: request.token.type
        }
        this.cdr_location = {
            id: request.location_id,
            address: "",
            city: "",
            postal_code: "",
            country: "",
            coordinates: {
                latitude: "0.0",
                longitude: "0.0"
            },
            evse_uid: request.evse_uid || "",
            evse_id: "",
            connector_id: request.connector_id || "",
            connector_standard: "IEC_62196_T2",
            connector_format: "SOCKET",
            connector_power_type: "AC_3_PHASE"
        }
        this.currency = "EUR"
        this.charging_periods = [{
            start_date_time: this.start_date_time,
            dimensions: [{
                type: "TIME",
                volume: duration
            }],
            tariff_id: ""
        }]
        this.total_cost = {
            excl_vat: 0,
            incl_vat: 0
        }
        this.total_energy = kwh
        this.total_time = duration
        this.last_updated = this.end_date_time

    }

    private calculateTotalTime(start: Date): number {
        const durationSeconds = (new Date().getTime() - start.getTime()) / 1000
        return durationSeconds / 60 / 60
    }

}
