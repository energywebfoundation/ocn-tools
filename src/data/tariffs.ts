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
import { ITariff } from "ocn-bridge/dist/models/ocpi/tariffs";
import { config } from "../config/config";
import { extractCPO } from "../tools/tools";

const cpo = extractCPO(config.cpo.roles)

export const tariffs: ITariff[] = [
    {
        country_code: cpo.country_code,
        party_id: cpo.party_id,
        id: "1",
        currency: "CHF",
        elements: [{
            price_components: [
                {
                    type: "FLAT",
                    price: 0.5,
                    vat: 0.077,
                    step_size: 1
                }, 
                {
                    type: "ENERGY",
                    price: 0.25,
                    vat: 0.077,
                    step_size: 1000        
                }
            ]
        }],
        last_updated: new Date().toISOString()
    },
    {
        country_code: cpo.country_code,
        party_id: cpo.party_id,
        id: "2",
        currency: "CHF",
        elements: [{
            price_components: [
                {
                    type: "FLAT",
                    price: 0.5,
                    vat: 0.077,
                    step_size: 1
                }, 
                {
                    type: "TIME",
                    price: 2,
                    vat: 0.077,
                    step_size: 900        
                }
            ]
        }],
        last_updated: new Date().toISOString()
    },
    {
        country_code: cpo.country_code,
        party_id: cpo.party_id,
        id: "3",
        currency: "CHF",
        elements: [{
            price_components: [
                {
                    type: "FLAT",
                    price: 8,
                    vat: 0.077,
                    step_size: 1
                }
            ]
        }],
        last_updated: new Date().toISOString()
    }
]
