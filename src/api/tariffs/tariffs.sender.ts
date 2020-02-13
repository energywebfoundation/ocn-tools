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
import { IConnector } from "ocn-bridge/dist/models/ocpi/locations"
import { ITariff } from "ocn-bridge/src/models/ocpi/tariffs"
import { tariffs } from "../../data/tariffs"

export class TariffsSender {

    public async getList(): Promise<ITariff[]> {
        return tariffs
    }

    public async getObjectById(id: string | IConnector): Promise<ITariff | undefined> {
        return tariffs.find((tariff) => tariff.id === id)
    }

    public async getObjectByConnector(connector: IConnector): Promise<ITariff | undefined> {
        const tariffIds = connector.tariff_ids
        if (!tariffIds || !tariffIds[0]) {
            return
        }
        return tariffs.find((tariff) => tariff.id === tariffIds[0])
    }

}
