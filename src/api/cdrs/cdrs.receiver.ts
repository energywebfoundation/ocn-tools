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

import { IChargeDetailRecord } from "@shareandcharge/ocn-bridge/dist/models/ocpi/cdrs";

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