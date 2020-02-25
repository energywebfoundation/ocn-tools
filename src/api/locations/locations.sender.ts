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

import { IConnector, IEvse, ILocation } from "@shareandcharge/ocn-bridge/dist/models/ocpi/locations";
import { locations } from "../../data/locations";

export class LocationsSender {

    public async getList(): Promise<ILocation[]> {
        return locations
    }

    public async getObject(id: string): Promise<ILocation | undefined> {
        const found = locations.find((location) => location.id === id)
        return found
    }

    public async getEvse(locationID: string, evseUID: string): Promise<IEvse | undefined> {
        const location = await this.getObject(locationID)
        if (!location || !location.evses) {
            return
        }
        const found = location.evses.find((evse) => evse.uid === evseUID)
        return found
    }

    public async getConnector(locationID: string, evseUID: string, connectorID: string): Promise<IConnector | undefined> {
        const evse = await this.getEvse(locationID, evseUID)
        if (!evse) {
            return
        }
        const found = evse.connectors.find((connector) => connector.id === connectorID)
        return found
    }

}