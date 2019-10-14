import { ITariff } from "ocn-bridge/src/models/ocpi/tarifffs"
import { tariffs } from "../data/tariffs"

export class Tariffs {

    public async getList(): Promise<ITariff[]> {
        return tariffs
    }
}
