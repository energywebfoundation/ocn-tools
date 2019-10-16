import { IChargeDetailRecord } from "ocn-bridge/dist/models/ocpi/cdrs";

export class CdrsReceiver {

    private cdrs: IChargeDetailRecord[] = []

    public async get(id: string): Promise<IChargeDetailRecord | undefined> {
        return this.cdrs.find((cdr) => cdr.id === id)
    }

    public create(cdr: IChargeDetailRecord): void {
        this.cdrs.push(cdr)
        setTimeout(() => console.log(`CDR ${cdr.id}: ${cdr.total_cost.excl_vat} ${cdr.currency}`), 50)
        return
    }

}