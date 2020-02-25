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

import { IConnector, ILocation } from "@shareandcharge/ocn-bridge/dist/models/ocpi/locations"
import { ITariff } from "@shareandcharge/ocn-bridge/dist/models/ocpi/tariffs"
import { IStartSession } from "@shareandcharge/ocn-bridge/dist/models/pluggableAPI"
import { sendCdrFunc, sendSessionFunc } from "@shareandcharge/ocn-bridge/dist/services/push.service"
import { sessionStatus } from "@shareandcharge/ocn-bridge/src/models/ocpi/session"
import { Cdr } from "./cdr"
import { Session } from "./session"

export class MockMonitor {

    private sessionUpdateScheduler: NodeJS.Timer
    private consumptionIncrementScheduler: NodeJS.Timer
    private consumptionIncrement: number
    private kwh: number
    private start: Date

    constructor(private id: string, private request: IStartSession, private location: ILocation, private connector: IConnector, 
                private sendSession: sendSessionFunc, private sendCdr: sendCdrFunc, private tariff?: ITariff) {

        // init mocked session details
        this.kwh = 0
        this.start = new Date()
        
        // set interval of updates in seconds
        const interval = 15 * 1000

        // set charging conditions
        this.consumptionIncrement = this.calculateConsumptionIncrement(connector)

        // schedule consumption
        this.consumptionIncrementScheduler = setInterval(() => {
            this.kwh += (this.consumptionIncrement / 1000)
        }, 1000)

        // schedule every interval
        this.sessionUpdateScheduler = setInterval(async () => {

            this.updateSession("ACTIVE")

        }, interval)

        // send the first session
        setTimeout(() => this.updateSession("ACTIVE"), 1000)
    }

    public async updateSession(status: sessionStatus): Promise<void> {
        const session = new Session(this.id, this.start, this.kwh, status, this.request)
        await this.sendSession(session)
    }

    public async stop(): Promise<void> {
        if (this.sessionUpdateScheduler) {
            clearInterval(this.consumptionIncrementScheduler)
            clearInterval(this.sessionUpdateScheduler)
            setTimeout(() => this.updateSession("COMPLETED"), 1000)
            const cdr = new Cdr(this.id, this.start, this.kwh, this.request, this.location, this.connector, this.tariff)
            setTimeout(() => this.sendCdr(cdr), 1500)
        }
    }

    private calculateConsumptionIncrement(connector: IConnector): number {
        let increment: number = 0
        const power = connector.max_voltage * connector.max_amperage
        switch (connector.power_type) {
            case "AC_1_PHASE":
                increment = power / 60 / 60
                break
            case "AC_3_PHASE":
                increment = power * Math.sqrt(3) / 60 / 60
                break
            case "DC":
                increment = power / 60 / 60
                break
        }
        return increment
    }

}
