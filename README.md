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

### 3. Prepare environment variables for registration

The mock MSP/CPO, in addition to the provided configuration parameters, need at least two environment variables in 
order to register the party to the OCN Registry and connect to an OCN Client. Because these variables are only needed
to register, they can be discarded on future runs.

These variables are:

- `TOKEN_A` - the OCPI credentials TOKEN_A which allows the party to connect to an OCN client
- `SIGNER_KEY` - the private key used to sign the OCN registry listing
- `SPENDER_KEY` - [optional] the private key which will pay the transaction fee for adding the party to the OCN registry (same as `SIGNER_KEY` if not provided)

#### Token A

The `TOKEN_A` can be obtain from an OCN client (should be the same as the one in the config). If the API key is known, 
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

On subsequent runs (assuming the party is already registered), the MSP or CPO can simply be run like so:

```
npm run start-msp
```

or 

```
npm run start-cpo
```

## Modifying default data

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

## CLI API

You can run the CLI entry point with `npm start`, however flags need to be declared with an additional `--`, e.g.

```
npm start -- --help
npm start mock -- --cpo
```

You can also use `node` or `ts-node`. As `ocn-tools` is written in TypeScript, it needs to be
transpiled into JavaScript first:

```
npm run build
node dist/index.js --help
```

If you want to run the TypeScript directly, you can use `ts-node`. It is included as a dependency for local use:

```
./node_modules/.bin/ts-node src --help
```

Or it can be installed globally:

```
npm i -g typescript ts-node
ts-node src --help
```
