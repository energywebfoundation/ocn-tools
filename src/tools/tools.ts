import { IRole } from "ocn-bridge/dist/models/ocpi/credentials";

export const extractCPO = (roles: IRole[]): IRole => {
    const cpo = roles.find((role) => role.role === "CPO")
    if (!cpo) {
        throw Error("No CPO role provided in \"config.cpo.roles\"")
    }
    return cpo
}
