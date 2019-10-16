import { ISession } from "ocn-bridge/dist/models/ocpi/session";

export class SessionsReceiver {

    public update(session: ISession): void {
        setTimeout(() => console.log(`Session ${session.id} ${session.status} - ${session.kwh} kWh`), 50)
        return
    }

}