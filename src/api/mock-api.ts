/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { IPluggableAPI } from "ocn-bridge";
import { Cdrs } from "./cdrs/cdrs";
import { Commands } from "./commands/commands";
import { Locations } from "./locations/locations";
import { Sessions } from "./sessions/session";
import { Tariffs } from "./tariffs/tariffs";

export class MockAPI implements IPluggableAPI {
    public locations = new Locations()
    public tariffs = new Tariffs()
    public commands = new Commands(this.locations, this.tariffs)
    public sessions = new Sessions()
    public cdrs = new Cdrs()
}
