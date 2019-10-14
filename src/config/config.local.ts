import * as uuid from "uuid"

export const config = {
    ocn: {
        client: "http://localhost:8080",
        registry: {
            provider: "http://localhost:8544",
            address: "0x345ca3e014aaf5dca488057592ee47305d9b3e10"
        }
    },
    cpo: {
        port: 3000,
        publicIP: "http://localhost:3000",
        roles: [
            {
                party_id: "CPO",
                country_code: "CH",
                role: "CPO",
                business_details: {
                    name: `Test CPO ${uuid.v4()}`
                }
            }
        ]
    },
    msp: {
        port: 3001,
        publicIP: "http://localhost:3001",
        roles: [
            {
                party_id: "MSP",
                country_code: "CH",
                role: "EMSP",
                business_details: {
                    name: `Test MSP ${uuid.v4()}`
                }
            }
        ]
    }

}