import { IStartSession } from "ocn-bridge/dist/models/pluggableAPI"
import { sendCdrFunc, sendSessionFunc } from "ocn-bridge/dist/services/push.service"
import { sessionStatus } from "ocn-bridge/src/models/ocpi/session"
import { Cdr } from "./cdr"
import { Session } from "./session"

export class MockMonitor {

    private scheduler: NodeJS.Timer
    private kwh: number
    private start: Date

    constructor(private id: string, private request: IStartSession, private sendSession: sendSessionFunc, private sendCdr: sendCdrFunc) {

        // init mocked session details
        this.kwh = 0
        this.start = new Date()

        // set interval of updates in seconds
        const interval = 10 * 1000

        // schedule every interval
        this.scheduler = setInterval(async () => {

            this.updateSession("ACTIVE")

        }, interval)

        // send the first session
        setTimeout(() => this.updateSession("ACTIVE"), 1000)
    }

    public async updateSession(status: sessionStatus): Promise<void> {
        const session = new Session(this.id, this.start, this.kwh, status, this.request)
        await this.sendSession(session)
        this.kwh += 0.1
    }

    public async stop(): Promise<void> {

        if (this.scheduler) {

            clearInterval(this.scheduler)

            const session = new Session(this.id, this.start, this.kwh, "COMPLETED", this.request)

            setTimeout(() => this.sendSession(session), 1000)

            const cdr = new Cdr(this.id, this.start, this.kwh, this.request)

            setTimeout(() => this.sendCdr(cdr), 1500)

        }

    }

}
