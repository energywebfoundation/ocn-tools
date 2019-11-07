import { IConnector, IEvse, ILocation } from "ocn-bridge/dist/models/ocpi/locations";
import { locations } from "../../data/locations";

export class LocationsSender {

    public async getList(): Promise<ILocation[]> {
        return locations
    }

    public async getObject(id: string): Promise<ILocation | undefined> {
        const found = locations.find((location) => location.id === id)
        return found
    }

    public async getEvse(locationID: string, evseUID: string): Promise<IEvse | undefined> {
        const location = await this.getObject(locationID)
        if (!location || !location.evses) {
            return
        }
        const found = location.evses.find((evse) => evse.uid === evseUID)
        return found
    }

    public async getConnector(locationID: string, evseUID: string, connectorID: string): Promise<IConnector | undefined> {
        const evse = await this.getEvse(locationID, evseUID)
        if (!evse) {
            return
        }
        const found = evse.connectors.find((connector) => connector.id === connectorID)
        return found
    }

    public async getEnergyMix(id: string): Promise<ILocation | undefined> {
        const energyMix = locations.find((location) => location.id === id)
        if (!energyMix || energyMix.energy_mix) {
            return
        }
        return energyMix.energy_mix
    }

}