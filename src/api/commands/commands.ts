import { Locations } from "../locations/locations";
import { Tariffs } from "../tariffs/tariffs";
import { CommandsReceiver } from "./commands.receiver";
import { CommandsSender } from "./commands.sender";

export class Commands {
    public sender = new CommandsSender()
    public receiver: CommandsReceiver

    constructor(locations: Locations, tariffs: Tariffs) {
        this.receiver = new CommandsReceiver(locations, tariffs)
    }
}