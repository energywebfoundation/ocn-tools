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

import { ICdrLocation, IChargeDetailRecord } from "@shareandcharge/ocn-bridge/dist/models/ocpi/cdrs";
import { IConnector, ILocation } from "@shareandcharge/ocn-bridge/dist/models/ocpi/locations";
import { authMethod, ICdrToken, IChargingPeriod, IPrice } from "@shareandcharge/ocn-bridge/dist/models/ocpi/session";
import { IPriceComponent, ITariff } from "@shareandcharge/ocn-bridge/dist/models/ocpi/tariffs";
import { IStartSession } from "@shareandcharge/ocn-bridge/dist/models/pluggableAPI";
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

    constructor(sessionID: string, start: Date, kwh: number, request: IStartSession, location: ILocation, connector: IConnector, tariff?: ITariff) {
        const cpo = extractCPO(config.cpo.roles)
        const duration = this.calculateTotalTime(start)

        this.country_code = cpo.country_code
        this.party_id = cpo.party_id

        this.session_id = sessionID
        this.start_date_time = start.toISOString()
        this.end_date_time = new Date().toISOString()
        this.cdr_token = {
            uid: request.token.uid,
            contract_id: request.token.contract_id,
            type: request.token.type
        }
        this.cdr_location = {
            id: request.location_id,
            address: location.address,
            city: location.city,
            postal_code: location.postal_code || "",
            country: location.country,
            coordinates: location.coordinates,
            evse_uid: request.evse_uid!,
            evse_id: location.evses!.find((evse) => evse.uid === request.evse_uid!)!.evse_id || "",
            connector_id: connector.id,
            connector_standard: connector.standard,
            connector_format: connector.format,
            connector_power_type: connector.power_type
        }
        this.currency = "EUR"
        this.tariffs = tariff ? [tariff] : undefined
        this.charging_periods = [{
            start_date_time: this.start_date_time,
            dimensions: [{
                type: "TIME",
                volume: duration
            }],
            tariff_id: tariff ? tariff.id : undefined
        }]
        this.total_energy = parseFloat(kwh.toFixed(4))
        this.total_time = duration
        this.total_cost = this.calculateTotalCost(tariff)
        this.last_updated = this.end_date_time

    }

    private calculateTotalTime(start: Date): number {
        const durationSeconds = (new Date().getTime() - start.getTime()) / 1000
        return durationSeconds / 60 / 60
    }

    private calculateTotalCost(tariff?: ITariff): IPrice {
        const cost = { excl_vat: 0, incl_vat: 0 }

        if (!tariff) {
            return cost
        }

        for (const component of tariff.elements[0].price_components) {
    
            const componentCost = this.calculateCost(component)
            cost.excl_vat += componentCost.excl_vat

            if (componentCost.incl_vat) {
                cost.incl_vat += componentCost.incl_vat
            }
        }

        cost.excl_vat = parseFloat(cost.excl_vat.toFixed(2))
        cost.incl_vat = parseFloat(cost.incl_vat.toFixed(2))
            
        return cost
    }

    private calculateCost(component: IPriceComponent): IPrice {
        const cost = { excl_vat: 0, incl_vat: 0 }

        switch (component.type) {
            case "FLAT":
                cost.excl_vat = component.price
                break
            case "TIME":
                cost.excl_vat = Math.ceil((this.total_time / 3600) / component.step_size) * component.price
                break
            case "ENERGY":
                cost.excl_vat = Math.ceil(this.total_energy / component.step_size) * component.price
                break
            case "PARKING_TIME":
                cost.excl_vat = Math.ceil((this.total_time / 3600) / component.step_size) * component.price
                break
        }

        if (component.vat) {
            cost.incl_vat = cost.excl_vat + (cost.excl_vat * component.vat)
        }

        return cost
    }

}
