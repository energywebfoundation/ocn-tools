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