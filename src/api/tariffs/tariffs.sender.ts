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
