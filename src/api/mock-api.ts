import { IPluggableAPI } from "ocn-bridge";
import { Commands } from "./commands";
import { Locations } from "./locations";
import { Tariffs } from "./tariffs";

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
