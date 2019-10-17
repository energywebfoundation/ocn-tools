import { IChargeDetailRecord } from "ocn-bridge/dist/models/ocpi/cdrs";
import { cdrs } from "../../data/cdrs"

export class CdrsSender {

    public async getList(): Promise<IChargeDetailRecord[]> {
        return cdrs
    }

}