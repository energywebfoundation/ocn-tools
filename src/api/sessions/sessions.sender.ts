import { ISession } from "ocn-bridge/dist/models/ocpi/session";
import { sessions } from "../../data/sessions"

export class SessionsSender {

    public async getList(): Promise<ISession[]> {
        return sessions
    }

}