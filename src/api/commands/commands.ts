import { CommandsReceiver } from "./commands.receiver";
import { CommandsSender } from "./commands.sender";

export class Commands {
    public sender = new CommandsSender()
    public receiver = new CommandsReceiver()
}