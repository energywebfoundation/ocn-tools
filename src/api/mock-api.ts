import { IPluggableAPI } from "ocn-bridge";
import { Commands } from "./commands/commands";
import { Locations } from "./locations/locations";
import { Tariffs } from "./tariffs/tariffs";

export class MockAPI implements IPluggableAPI {
    public commands: Commands
    public locations: Locations
    public tariffs: Tariffs

    constructor() {
        this.commands = new Commands()
        this.locations = new Locations()
        this.tariffs = new Tariffs()
    }
}
