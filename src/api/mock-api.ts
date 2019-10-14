import { IPluggableAPI } from "ocn-bridge";
import { Commands } from "./commands";
import { Locations } from "./locations";

export class MockAPI implements IPluggableAPI {
    public commands: Commands
    public locations: Locations

    constructor() {
        this.commands = new Commands()
        this.locations = new Locations()
    }
}
