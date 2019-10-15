import { ITariff } from "ocn-bridge/src/models/ocpi/tariffs"
import { tariffs } from "../../data/tariffs"

export class TariffsSender {

    public async getList(): Promise<ITariff[]> {
        return tariffs
    }
}
