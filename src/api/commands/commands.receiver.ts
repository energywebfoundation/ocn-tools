import { CommandResponseType, CommandResultType, IAsyncCommand, ICommandResult } from "ocn-bridge/dist/models/ocpi/commands";
import { IReserveNow, IStartSession } from "ocn-bridge/dist/models/pluggableAPI";
import { sendCdrFunc, sendSessionFunc } from "ocn-bridge/dist/services/push.service";
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

const rejected = {
    commandResponse: {
        result: CommandResponseType.REJECTED,
        timeout: 0
    }
}

export class CommandsReceiver {

    private reservations: IReserveNow[] = []
    private sessions: { [key: string]: MockMonitor } = {}

    constructor(private locations: Locations, private tariffs: Tariffs) {}

    public async cancelReservation(): Promise<IAsyncCommand> {
        return {
            commandResponse: {
                result: CommandResponseType.NOT_SUPPORTED,
                timeout: 0
            }
        }
    }

    public async reserveNow(request: IReserveNow): Promise<IAsyncCommand> {
        // 1.1 check already reserved
        const alreadyReserved = this.reservations.find((res) => res.location_id === request.location_id && res.evse_uid === request.evse_uid && res.connector_id === request.connector_id)

        if (alreadyReserved) {
            return rejected
        }

        // 1.2 check location is reservable
        const connector = await this.locations.sender.getConnector(request.location_id, request.evse_uid!, request.connector_id!)

        if (!connector) {
            return rejected
        }

        // 2. check expiry_date is valid
        const duration = (new Date(request.expiry_date).getTime() - new Date().getTime()) / 1000    // seconds
        const max = 60 * 60 * 60 * 12

        if (duration > max) {
            return rejected
        }

        // 3. make reservation
        this.reservations.push(request)

        // 3.1 check expiry date met
        setInterval(() => {
            const isExpired = (new Date().getTime() - new Date(request.expiry_date).getTime()) > 0
            if (isExpired) {
                const index = this.reservations.findIndex((res) => res.reservation_id === request.reservation_id)
                delete this.reservations[index]
            }
        }, 1000 * 60 * 60)
        
        return {
            commandResponse: {
                result: CommandResponseType.ACCEPTED,
                timeout: 0
            }
        }
    }

    public async startSession(request: IStartSession, sendSession: sendSessionFunc, sendCdr: sendCdrFunc): Promise<IAsyncCommand> {

        // check evse exists first
        const evse = await this.locations.sender.getEvse(request.location_id, request.evse_uid!)

        if (!evse) {
            return {
                commandResponse: {
                    result: CommandResponseType.REJECTED,
                    timeout: 0
                }
            }
        }

        // need the location details, relevant connector and tariff for cdr
        const location = await this.locations.sender.getObject(request.location_id)
        const connector = evse.connectors[0]
        const tariff = await this.tariffs.sender.getObjectByConnector(connector)

        const sessionID = uuid.v4()
        this.sessions[sessionID] = new MockMonitor(sessionID, request, location!, connector, sendSession, sendCdr, tariff)

        return accepted
    }

    public async stopSession(sessionID: string): Promise<IAsyncCommand> {

        if (!this.sessions[sessionID]) {
            return {
                commandResponse: {
                    result: CommandResponseType.REJECTED,
                    timeout: 0
                }
            }
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
