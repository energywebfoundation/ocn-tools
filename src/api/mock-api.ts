import { IPluggableAPI } from "ocn-bridge";
import { Cdrs } from "./cdrs/cdrs";
import { Commands } from "./commands/commands";
import { Locations } from "./locations/locations";
import { Sessions } from "./sessions/session";
import { Tariffs } from "./tariffs/tariffs";

export class MockAPI implements IPluggableAPI {
    public commands = new Commands()
    public locations = new Locations()
    public tariffs = new Tariffs()
    public sessions = new Sessions()
    public cdrs = new Cdrs()
}
