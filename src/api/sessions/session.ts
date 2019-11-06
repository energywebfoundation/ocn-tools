import { SessionsReceiver } from "./sessions.receiver";
import { SessionsSender } from "./sessions.sender";

export class Sessions {
    public receiver = new SessionsReceiver()
    public sender = new SessionsSender()
}