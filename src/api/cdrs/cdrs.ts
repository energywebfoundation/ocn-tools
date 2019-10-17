import { CdrsReceiver } from "./cdrs.receiver";
import { CdrsSender } from "./cdrs.sender";

export class Cdrs {
    public receiver = new CdrsReceiver()
    public sender = new CdrsSender()
}