/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { ISession } from "@shareandcharge/ocn-bridge/dist/models/ocpi/session";

export const sessions: ISession[] = [{
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000001",
    start_date_time: "2019-10-16T10:42:00Z",
    end_date_time: "2019-10-16T12:42:00Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00001",
        contract_id: "USERCON00001",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc1",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 3.5
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
},
{
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000002",
    start_date_time: "2019-10-16T11:16:35Z",
    end_date_time: "2019-10-16T14:30:15Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00002",
        contract_id: "USERCON00002",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc2",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 4.25
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
},
{
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000003",
    start_date_time: "2019-10-16T11:21:13Z",
    end_date_time: "2019-10-17T15:30:38Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00003",
        contract_id: "USERCON00003",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc3",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 20.5
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
},
{
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000004",
    start_date_time: "2019-10-16T11:23:43Z",
    end_date_time: "2019-10-17T06:58:15Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00004",
        contract_id: "USERCON00004",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc4",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 11.75
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
}, {
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000005",
    start_date_time: "2019-10-16T11:26:43Z",
    end_date_time: "2019-10-16T13:26:43Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00005",
        contract_id: "USERCON00005",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc5",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 4.5
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
}, {
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000006",
    start_date_time: "2019-10-16T11:26:43Z",
    end_date_time: "2019-10-16T12:16:43Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00005",
        contract_id: "USERCON00006",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc6",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 2.5
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
},
{
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000007",
    start_date_time: "2019-10-16T11:34:43Z",
    end_date_time: "2019-10-17T11:34:43Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00006",
        contract_id: "USERCON00007",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc7",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 6.5
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
},
{
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000008",
    start_date_time: "2019-10-16T11:34:43Z",
    end_date_time: "2019-10-16T14:34:43Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00008",
        contract_id: "USERCON00008",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc7",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 8
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
},
{
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000009",
    start_date_time: "2019-10-16T11:34:43Z",
    end_date_time: "2019-10-17T08:34:43Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00009",
        contract_id: "USERCON00009",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc9",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 8
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
},
{
    country_code: "CH",
    party_id: "CPO",
    id: "SES0000000010",
    start_date_time: "2019-10-16T11:34:43Z",
    end_date_time: "2019-10-17T10:34:43Z",
    kwh: 1.5,
    cdr_token: {
        uid: "USER00010",
        contract_id: "USERCON00010",
        type: "APP_USER"
    },
    auth_method: "COMMAND",
    location_id: "loc10",
    evse_uid: "CH-CPO-S01E01",
    connector_id: "S01E01Con1",
    currency: "CHF",
    total_cost: {
        excl_vat: 8
    },
    status: "COMPLETED",
    last_updated: new Date().toISOString()
}
]
