import { authMethod } from "ocn-bridge/dist/models/ocpi/session";
import { ICdrToken, ISession, sessionStatus } from "ocn-bridge/src/models/ocpi/session";
import { IStartSession } from "ocn-bridge/src/models/pluggableAPI";
import { config } from "../config/config";
import { extractCPO } from "../tools/tools";

export class Session implements ISession {

    public country_code: string
    public party_id: string
    public id: string
    public start_date_time: string
    // public end_date_time?: Date
    public kwh: number
    public cdr_token: ICdrToken
    public auth_method: authMethod = "COMMAND"
    // public authorization_reference?: string
    public location_id: string
    public evse_uid: string
    public connector_id: string
    // public meter_id?: string
    public currency: string = "EUR"
    // public charging_periods?: IChargingPeriod[]
    // public total_cost?: IPrice
    public status: sessionStatus
    public last_updated: string

    constructor(id: string, start: Date, kwh: number, status: sessionStatus, request: IStartSession) {
        const cpo = extractCPO(config.cpo.roles)
        this.country_code = cpo.country_code
        this.party_id = cpo.party_id

        this.id = id
        this.start_date_time = start.toISOString()
        this.kwh = Math.round(kwh * 1e4) / 1e4
        this.cdr_token = {
            uid: request.token.uid,
            contract_id: request.token.contract_id,
            type: request.token.type
        }
        this.location_id = request.location_id
        this.evse_uid = request.evse_uid || ""
        this.connector_id = ""
        this.status = status
        this.last_updated = new Date().toISOString()
    }

}
