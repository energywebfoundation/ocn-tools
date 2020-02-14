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
import { CommandResponseType, CommandResultType, IAsyncCommand, ICommandResult } from "ocn-bridge/dist/models/ocpi/commands";
import { IReserveNow, IStartSession } from "ocn-bridge/dist/models/pluggableAPI";
import { sendCdrFunc, sendSessionFunc } from "ocn-bridge/dist/services/push.service";
import { isDeepStrictEqual } from "util";
import uuid from "uuid";
import { MockMonitor } from "../../models/mock-monitor";
import { Locations } from "../locations/locations";
import { Tariffs } from "../tariffs/tariffs";

const accepted = {
    commandResponse: {
        result: CommandResponseType.ACCEPTED,
        timeout: 30
    },
    commandResult: async (): Promise<ICommandResult> => {
        return new Promise((resolve, _) => {
            setTimeout(() => resolve({ result: CommandResultType.ACCEPTED }), 250)   
        })
    }
}

const rejected = (message: string) => {
    return {
        commandResponse: {
            result: CommandResponseType.REJECTED,
            message,
            timeout: 0
        }
    }
}

export class CommandsReceiver {

    private reservations: IReserveNow[] = []
    private sessions: { [key: string]: MockMonitor } = {}

    constructor(private locations: Locations, private tariffs: Tariffs) {}

    public async cancelReservation(id: string): Promise<IAsyncCommand> {
        const index = this.reservations.findIndex((res) => res.reservation_id === id)

        if (index < 0) {
            return rejected("reservation_id does not exist")
        }

        this.reservations.splice(index, 1)

        return accepted
    }

    public async reserveNow(request: IReserveNow): Promise<IAsyncCommand> {
        // 1.1 check already reserved
        const alreadyReserved = this.reservations.find((res) => res.location_id === request.location_id 
            && res.evse_uid === request.evse_uid
            && res.connector_id === request.connector_id
            && res.reservation_id !== request.reservation_id)

        if (alreadyReserved) {
            return rejected("Location already reserved under different reservation id")
        }

        // 1.2 check location is reservable
        const evse = await this.locations.sender.getEvse(request.location_id, request.evse_uid!)

        if (!evse) {
            return rejected("EVSE does not exist, provide correct location_id and evse_uid to reserve")
        }

        // 2. check expiry_date is valid
        const duration = (new Date(request.expiry_date).getTime() - new Date().getTime()) / 1000
        const max = 60 * 60 * 12

        if (duration > max || duration < 0) {
            return rejected("Invalid expiry_date, should be between 0 and 12 hours in the future")
        }

        // 3. overwrite or make reservation
        let index = this.reservations.findIndex((res) => res.reservation_id === request.reservation_id)
        if (index >= 0) {
            this.reservations[index] = request
        } else {
            this.reservations.push(request)
        } 

        // 3.1 check expiry date met
        const interval = setInterval(() => {
            index = this.reservations.findIndex((res) => res.reservation_id === request.reservation_id)
            if (index < 0) {
                return clearInterval(interval)
            }
            const isExpired = (new Date().getTime() - new Date(request.expiry_date).getTime()) > 0
            if (isExpired) {
                this.reservations.splice(index, 1)
                clearInterval(interval)
            }
        }, 1000 * 10)
        
        return accepted
    }

    public async startSession(request: IStartSession, sendSession: sendSessionFunc, sendCdr: sendCdrFunc): Promise<IAsyncCommand> {

        // check evse exists first
        const evse = await this.locations.sender.getEvse(request.location_id, request.evse_uid!)

        if (!evse) {
            return rejected("EVSE does not exist")
        }

        // check evse has not been reserved
        const reserved = this.reservations.find((res) => res.location_id === request.location_id && res.evse_uid === request.evse_uid)
        let reservationIndex = -1
        if (reserved) {
            reservationIndex = this.reservations.findIndex((res) => res.reservation_id === reserved.reservation_id)
            if (!isDeepStrictEqual(reserved.token, request.token)) {
                return rejected("EVSE has been reserved by a different EV driver")
            }
        }

        // need the location details, relevant connector and tariff for cdr
        const location = await this.locations.sender.getObject(request.location_id)
        const connector = evse.connectors[0]
        const tariff = await this.tariffs.sender.getObjectByConnector(connector)

        const sessionID = uuid.v4()
        this.sessions[sessionID] = new MockMonitor(sessionID, request, location!, connector, sendSession, sendCdr, tariff)

        if (reservationIndex >= 0) {
            this.reservations.splice(reservationIndex, 1)
        }

        return accepted
    }

    public async stopSession(sessionID: string): Promise<IAsyncCommand> {

        if (!this.sessions[sessionID]) {
            return rejected("session_id does not exist")
        }

        await this.sessions[sessionID].stop()
        delete this.sessions[sessionID]

        return accepted
    }

    public async unlockConnector(): Promise<IAsyncCommand> {
        return {
            commandResponse: {
                result: CommandResponseType.NOT_SUPPORTED,
                timeout: 0
            }
        }
    }

}
