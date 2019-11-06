# Open Charging Network Tools

Contains common tools for aiding development of applications built on top of the OCN. 

## Setup

```
git clone git@bitbucket.org:shareandcharge/ocn-tools.git
npm install
```

# Mock OCPI parties

It is possible to run a mock E-Mobility Service Provider (MSP) or Charge Point Operator (CPO) with these tools.

## Configuration

### 1. Copy and modify the default config file

Configuration for both MSP and CPO can be found in the `src/config` directory. The mock servers will look for a
`src/config/config.ts` file which is not provided out of the box (to avoid version control conflicts). Therefore, 
before starting a mock server, copy the provided local configuration file and edit to match the desired environment:

```
cp src/config/config.local.ts src/config/config.ts
```

See also the example `config.volta.ts` config which shows an example of config parameters needed to connect to
the Energy Web Chain's Volta test network. In this case, the `ocn.client` is fake and the `publicIP` of the `msp`
and `cpo` config options should be changed to match the desired public IP of the OCPI party. This is required 
because as part of the OCPI credentials handshake, the OCN client needs to fetch supported versions and modules 
from the OCPI party.

### 2. Prepare environment variables for registration

The mock MSP/CPO, in addition to the provided configuration parameters, need at least two environment variables in 
order to register the party to the OCN Registry and connect to an OCN Client. Because these variables are only needed
to register, they can be discarded on future runs.

These variables are:

- `TOKEN_A` - the OCPI credentials TOKEN_A which allows the party to connect to an OCN client
- `SIGNER_KEY` - the private key used to sign the OCN registry listing
- `SPENDER_KEY` - [optional] the private key which will pay the transaction fee for adding the party to the OCN registry (same as `SIGNER_KEY` if not provided)

#### Token A

The `TOKEN_A` can be obtained from an OCN client (should be the same as the one in the config). If the API key is known, 
a curl request can be made like so:

```
curl -XPOST localhost:8080/admin/generate-registration-token -H 'Authorization: Token randomkey' -H 'Content-Type: application/json' -d '[{"country_code": "CH", "party_id": "CPO"}]'
```

Otherwise, `TOKEN_A` can be retrieved offline from the chosen OCN client's administrator. 

#### Private keys

An Ethereum-compliant private key is needed to sign the transaction detailing the OCPI party's OCN registry listing, but 
it does not need to be the same as the key that sends the transaction to the network.

In any case, it is often simpler to use the same key for signing and paying, especially on test networks where funds to 
pay for transactions are easily obtainable (and for free).

If running a local network, it is possible to grab a private key from e.g. `ganache` which is already funded. If testing 
on the Energy Web Chain's Volta test network, you could instead fund your private key's wallet using the [faucet](https://voltafaucet.energyweb.org/).

## Running

Once setup, a mock MSP or CPO can be started as follows:

```
TOKEN_A=ec005952-8c33-4bc0-8032-e07fdc420931 SIGNER_KEY=0x659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63 npm run start-msp
```

Likewise the `npm` script `start-cpo` can be used to start and register the CPO server.

If all was successful, something similar to the following should be printed to stdout:

```
Starting MSP server...
GET /ocpi/versions 200 4.932 ms - 147
GET /ocpi/versions/2.2 200 1.924 ms - 298
MSP server listening for OCPI requests
```

If you only want to register the party, without a long-running server process, you may use the `--register-only` flag:

```
TOKEN_A=ec005952-8c33-4bc0-8032-e07fdc420931 SIGNER_KEY=0x659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63 npm run start-msp -- --register-only
```

The server will then exit after registration is complete.

On subsequent runs (assuming the party is already registered), the MSP or CPO can simply be started like so:

```
npm run start-msp
```

or 

```
npm run start-cpo
```

## Next steps 

### Modifying default data

Data provided by the MSP or CPO (tokens, locations, tariffs etc.) exists in `src/data` and can be modified if necessary. Each
data file is written in TypeScript, providing OCPI types and programmatic creation of data. It is also completely interoperable 
with JSON data:

For example, `locations.ts`:

```ts
export const locations: ILocation[] = [
    {
        "country_code": "DE",
        "party_id": "CPO",
        "id": "abc123",
        ...
    }
]
```

or

```ts
export const locations: ILocation[] = []

for (i = 0; i < 10000000; i++) {
    locations.push({
        country_code: "DE",
        party_id: "CPO",
        id: "abc123",
        ...
    })
}
```

### Making requests

To make a request as the mock MSP or CPO, it is necessary to find the `TOKEN_C` which was given to the party during
the OCPI credentials registration handshake with the OCN client. To do so, run the following:

For the MSP:
```
sqlite3 msp.db "select token_c from auth;"
```

For the CPO:
```
sqlite3 cpo.db "select token_c from auth;"
```

Using the displayed token, requests can be made to the OCN client in OCPI format (version 2.2 RC2). The following 
request examples assume that both MSP and CPO servers have been registered and are awaiting OCPI requests.
Therefore, open a terminal session for each server, and an additional one to make the requests. The requests can 
be used again for requests to additional MSPs/CPOs, though note that the actual results may differ as
the OCPI implementation could be different (e.g. a CPO might not push session updates).

#### Get locations

You can send the following GET locations request as MSP, replacing the Authrozation TOKEN_C with that which was 
obtained using the above SQL command.  

```
curl -s localhost:8080/ocpi/sender/2.2/locations -H "Authorization: Token {{TOKEN_C}}" -H "X-Request-ID: 0" -H "X-Correlation-ID: 0" -H "OCPI-From-Country-Code: CH" -H "OCPI-From-Party-Id: MSP" -H "OCPI-To-Country-Code: CH" -H "OCPI-To-Party-Id: CPO"
```

To parse command line responses, [`jq`](https://stedolan.github.io/jq/) is recommended.

For example, check if the OCPI response was successful (should be 1000):

```
{{REQUEST}} | jq .status_code
```

Pretty print response data:

```
{{REQUEST}} | jq .data
```

Count objects in response data array:

```
{{REQUEST}} | jq '.data | length'
```

#### Get tariffs

Likewise, tariffs can be obtained from the CPO using:

```
curl -s localhost:8080/ocpi/sender/2.2/tariffs -H "Authorization: Token {{TOKEN_C}}" -H "X-Request-ID: 0" -H "X-Correlation-ID: 0" -H "OCPI-From-Country-Code: CH" -H "OCPI-From-Party-Id: MSP" -H "OCPI-To-Country-Code: CH" -H "OCPI-To-Party-Id: CPO"
```

#### Get Cdrs

Charge detail records can also be obtained from the CPO using:

```
curl -s localhost:8080/ocpi/sender/2.2/cdrs -H "Authorization: Token {{TOKEN_C}}" -H "X-Request-ID: 0" -H "X-Correlation-ID: 0" -H "OCPI-From-Country-Code: CH" -H "OCPI-From-Party-Id: MSP" -H "OCPI-To-Country-Code: CH" -H "OCPI-To-Party-Id: CPO"
```

#### Get Sessions

Sessions can also be obtained from the CPO using:

```
curl -s localhost:8080/ocpi/sender/2.2/sessions -H "Authorization: Token {{TOKEN_C}}" -H "X-Request-ID: 0" -H "X-Correlation-ID: 0" -H "OCPI-From-Country-Code: CH" -H "OCPI-From-Party-Id: MSP" -H "OCPI-To-Country-Code: CH" -H "OCPI-To-Party-Id: CPO"
```

#### Start charging session

To start a charging session, use the following example command, containing the driver's OCPI token 
(the mock CPO will accept any) and the location/evse they will charge at (the mock CPO will reject 
the request if it does not know the location):

```
curl -s -XPOST localhost:8080/ocpi/receiver/2.2/commands/START_SESSION -H "Authorization: Token {{TOKEN_C}}" -H "X-Request-ID: 0" -H "X-Correlation-ID: 0" -H "OCPI-From-Country-Code: CH" -H "OCPI-From-Party-Id: MSP" -H "OCPI-To-Country-Code: CH" -H "OCPI-To-Party-Id: CPO" -H "Content-Type: application/json" -d '{"response_url": "http://localhost:3001/ocpi/sender/2.2/commands/START_SESSION/0", "location_id": "Loc1", "evse_uid": "CH-CPO-S1E100001", "token": {"country_code": "CH", "party_id": "MSP", "uid": "0", "type": "AD_HOC_USER", "contract_id": "0", "issuer": "test MSP", "valid": true, "whitelist": "NEVER", "last_updated": "2019-10-14T15:45:11.353Z"}}'
```

This is an *asynchronous* request. In OCPI terms, this means that the CPO will call the sender back via the given 
`response_url` with additional information.

When sending the request, the initial response should tell us that our request has been accepted:

```json
{
  "status_code": 1000,
  "data": {
    "result": "ACCEPTED",
    "timeout": 30
  },
  "timestamp": "2019-10-15T14:25:05.924Z"
}
```

When looking at the logs of the MSP server, there is additional information:

```html
POST /ocpi/sender/2.2/commands/START_SESSION/0 200 0.696 ms - 59
async command result [START_SESSION 0]: ACCEPTED
```

This is the asynchronous command result from the CPO, notifying us on the `response_url` we have provided, that the 
charge point has accepted the session request.

#### Stop charging session

To stop a charging session, we need to obtain its ID.

When looking at the MSP server logs, we can see that there has also been a PUT request made to the OCPI sessions 
receiver module:

```html
PUT /ocpi/receiver/2.2/sessions/CH/CPO/c8cf0ab6-10a2-4c71-88aa-fee1ab29beea 200 5.526 ms - 59
Session c8cf0ab6-10a2-4c71-88aa-fee1ab29beea ACTIVE - 0.0029 kWh
```

Here, the path parameters `/{{country_code}}/{{party_id}}/{{session_id}}` tell us at a glance information about a new 
session. The mock CPO is currently configured to send out session updates every 30 seconds.

Now that we have the session ID, we can make the stop session request (make sure to change the `session_id` in 
the request's body):

```
curl -s -XPOST localhost:8080/ocpi/receiver/2.2/commands/STOP_SESSION -H "Authorization: Token {{TOKEN_C}}" -H "X-Request-ID: 0" -H "X-Correlation-ID: 0" -H "OCPI-From-Country-Code: CH" -H "OCPI-From-Party-Id: MSP" -H "OCPI-To-Country-Code: CH" -H "OCPI-To-Party-Id: CPO" -H "Content-Type: application/json" -d '{"response_url": "http://localhost:3001/ocpi/receiver/2.2/commands/STOP_SESSION/0", "session_id": {{SESSION_ID}}}'
```

The same asynchronous request flow is also present for stopping charging sessions. We can see that the MSP 
receives the async result on the `response_url` specified, however it also received an additional request:

```html
POST /ocpi/receiver/2.2/commands/STOP_SESSION/0 404 4.088 ms - 181
PUT /ocpi/receiver/2.2/sessions/CH/CPO/87351731-7a6d-4ce8-9037-df6ae5d0478f 200 2.118 ms - 59
Session 87351731-7a6d-4ce8-9037-df6ae5d0478f COMPLETED - 0.7392 kWh
POST /ocpi/receiver/2.2/cdrs 200 2.093 ms - 59
CDR 4545f2d2-3bdc-4156-a87c-b7a0f0c90d92: 0 EUR
```

This shows us that a new charge detail record has been received with, in this case, a price of 0 EUR.

### Reservation

Using the OCPI command `RESERVE_NOW` is also possible, in order to reserve a particular EVSE from now to the given `expiry_date`:

```
curl -X POST http://localhost:8080/ocpi/receiver/2.2/commands/RESERVE_NOW -H "Authorization: Token {{TOKEN_C}}" -H "Content-Type: application/json" -H "OCPI-From-Country-Code: CH" -H "OCPI-From-Party-ID: MSP" -H "OCPI-To-Country-Code: CH" -H "OCPI-To-Party-ID: CPO" -H "X-Correlation-ID: 1" -H "X-Request-ID: 1" -d '{"response_url": "http://localhost:3001/ocpi/sender/2.2/commands/RESERVE_NOW/0", "token": {"country_code": "CH", "party_id": "MSP", "uid": "1", "type": "APP_USER", "contract_id": "1", "issuer": "some msp", "valid": true, "whitelist": "NEVER", "last_updated": "2019-11-05T10:36:41.778Z"}, "expiry_date": "2019-11-05T18:36:41.778Z", "reservation_id": "1", "location_id": "Loc2", "evse_uid": "CH-CPO-S2E100001"}'
```

This will block the station until the `expiry_date` passes. During this time only the token that was used to reserve the EVSE can charge there. Once charging has started, the reservation will be deleted.

A reservation can be updated by sending a new `RESERVE_NOW` request with the `reservation id` which should be updated.

A reservation can be cancelled using the `CANCEL_RESERVATION` command:

```
curl -X POST http://localhost:8080/ocpi/receiver/2.2/commands/CANCEL_RESERVATION -H "Authorization: Token {{TOKEN_C}}" -H "Content-Type: application/json" -H "OCPI-From-Country-Code: CH" -H "OCPI-From-Party-ID: MSP" -H "OCPI-To-Country-Code: CH" -H "OCPI-To-Party-ID: CPO" -H "X-Correlation-ID: 1" -H "X-Request-ID: 1" -d '{"response_url": "http://localhost:3001/ocpi/sender/2.2/commands/CANCEL_RESERVATION/0", "reservation_id": "1"}'
```

As with other commands, this request is asynchronous.

## CLI API

You can run the CLI entry point with `npm start`, however flags need to be declared with an additional `--`, e.g.

```
npm start -- --help
npm start mock -- --cpo
npm run start-msp -- --register-only
```

You can also use `node` or `ts-node`. As `ocn-tools` is written in TypeScript, it needs to be
transpiled into JavaScript first:

```
npm run build
node dist/index.js --help
```

If you want to run the TypeScript code directly, you can use `ts-node`. It is included as a dependency for local use:

```
./node_modules/.bin/ts-node src --help
```

Or it can be installed globally:

```
npm i -g typescript ts-node
ts-node src --help
```
