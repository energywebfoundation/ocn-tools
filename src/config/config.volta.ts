import * as uuid from "uuid"

export const config = {
    ocn: {
        node: "http://node.ocn.org",
        registry: {
            provider: "http://35.178.1.16",
            address: "0x0A5f27Ee1EbDC68034aDbd9446F9375783aeF7DC"
        }
    },
    cpo: {
        port: 3000,
        publicIP: "http://mock.cpo.com",
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
        publicIP: "http://mock-msp.com",
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