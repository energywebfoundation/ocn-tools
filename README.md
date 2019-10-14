# Open Charging Network Tools

Contains common tools for aiding development of applications built on top of the OCN. 

# Mock OCPI parties

It is possible to run a mock eMobility Service Provider (MSP) or Charge Point Operator (CPO) with these tools.

To run the MSP:

```
npm start --msp
```

To run the CPO:

```
npm start --cpo
```

This will start an MSP or CPO server respectively and will also register the desired party on the chosen OCN.
Both parties will by default connect to a locally running OCN, so be sure to change this if necessary in 
`src/configconfig.json`.

If you only want to register the party, without running a server process, you may use the `--register-only` flag:

```
npm start --msp --register-only
```