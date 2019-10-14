import { DefaultRegistry, startBridge, stopBridge } from "ocn-bridge"
import * as yargs from "yargs"
import { MockAPI } from "./api/mock-api"
import { config } from "./config/config"
import { Database } from "./database"

yargs
    .command("mock", "Start a mock OCPI party server", (context) => {
        context
            .option("cpo", {
                alias: "c",
                boolean: true,
                describe: "Charge Point Operator"
            })
            .option("msp", {
                alias: "m",
                boolean: true,
                describe: "e-mobility service provider"
            })
            .option("register-only", {
                alias: "r",
                boolean: true,
                describe: "register party to OCN then close"
            })
            .help()
    }, async (args) => {
        
        if (!args.cpo && !args.msp) {
            console.log("Need one of options \"cpo\", \"msp\"")
            process.exit(1)
        }

        const mockAPI = new MockAPI()
        const registry = new DefaultRegistry(config.ocn.registry.provider, config.ocn.registry.address)

        if (args.cpo) {

            console.log("Starting CPO server...")

            const cpoServer = await startBridge({
                port: config.cpo.port,
                publicBridgeURL: config.cpo.publicIP,
                ocnClientURL: config.ocn.client,
                roles: config.cpo.roles,
                pluggableAPI: mockAPI,
                pluggableDB: new Database("cpo.db"),
                pluggableRegistry: registry,
                logger: true
            })

            console.log("CPO server listening for OCPI requests")

            if (args.registerOnly) {
                console.log("Shutting down CPO server...")
                await stopBridge(cpoServer)
            }
        } else if (args.msp) {

            console.log("Starting MSP server...")

            const mspServer = await startBridge({
                port: config.msp.port,
                publicBridgeURL: config.msp.publicIP,
                ocnClientURL: config.ocn.client,
                roles: config.msp.roles,
                pluggableAPI: mockAPI,
                pluggableDB: new Database("msp.db"),
                pluggableRegistry: registry,
                logger: true
            })

            console.log("MSP server listening for OCPI requests")

            if (args.registerOnly) {
                console.log("Shutting down MSP server...")
                await stopBridge(mspServer)
            }
        }

    })
    .help()
    .parse()