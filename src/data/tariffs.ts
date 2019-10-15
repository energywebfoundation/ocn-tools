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
        last_updated: new Date()
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
        last_updated: new Date()
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
        last_updated: new Date()
    }
]
