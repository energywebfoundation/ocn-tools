import { ICommandResult } from "ocn-bridge/dist/models/ocpi/commands";

export class CommandsSender {
    public asyncResult(command: string, uid: string, result: ICommandResult): void {
        setTimeout(() => console.log(`async command result [${command} ${uid}]: ${result.result}`), 50)
        return
    }
}