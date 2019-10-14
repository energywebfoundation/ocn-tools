import { ITariff } from "ocn-bridge/dist/models/ocpi/tarifffs";
import { config } from "../config/config"
import { extractCPO } from "../tools/tools";

const cpo = extractCPO(config.cpo.roles)

export const tariffs: ITariff[] = [
    {
        country_code: cpo.country_code,
        party_id: cpo.party_id,
        id: "1",
        currency: "CHF",
        elements: [{
          price_components: [{
              type: "ENERGY",
              price: 0.35,
              step_size: 1000
          }],
          restrictions: {
              max_kwh: 100
          }
        }],
        last_updated: new Date()
    }
]
