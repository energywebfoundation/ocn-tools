import { CommandResponseType, CommandResultType, IAsyncCommand, ICommandResult } from "ocn-bridge/dist/models/ocpi/commands";
import { IStartSession } from "ocn-bridge/src/models/pluggableAPI";
import { sendCdrFunc, sendSessionFunc } from "ocn-bridge/src/services/push.service";
import uuid from "uuid";
import { MockMonitor } from "../../models/mock-monitor";
import { Locations } from "../locations/locations";
import { Tariffs } from "../tariffs/tariffs";

export class CommandsReceiver {

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

    public async reserveNow(): Promise<IAsyncCommand> {
        return {
            commandResponse: {
                result: CommandResponseType.NOT_SUPPORTED,
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

        return {
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

        return {
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
