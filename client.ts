import { actionCreators, encodeSignedDelegate } from "@near-js/transactions";
import { getAccount } from "./account";

const CLIENT_ID = 'your-account.testnet';
const CLIENT_PRIVATE_KEY = "xxx";
const NETWORK_ID = 'testnet';
const CONTRACT_ID = 'hello.near-examples.testnet';
const SERVER_URL = 'http://localhost:3000/';

async function sendRelay() {
  const action = actionCreators.functionCall(
    'set_greeting',
    {
        greeting: "hello"
   },
   "3000000000000"
   );

  const account = await getAccount(NETWORK_ID, CLIENT_ID, CLIENT_PRIVATE_KEY);

  const signedDelegate = await account.signedDelegate({
    actions: [action],
    blockHeightTtl: 120,
    receiverId: CONTRACT_ID,
})

console.log(signedDelegate);

  const res = await fetch(SERVER_URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(Array.from(encodeSignedDelegate(signedDelegate))),
    headers: new Headers({ "Content-Type": "application/json" }),
  });
}

sendRelay();