import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { deserialize } from 'borsh';
import { Account } from "near-api-js";
import { SCHEMA, SignedDelegate, actionCreators } from "@near-js/transactions";
import { getAccount } from './account';

const app: Express = express();
app.use(cors());
app.use(express.json());

const RELAYER_ID = 'your-relayer-account.testnet'
const RELAYER_PRIVATE_KEY = 'xxx'
const NETWORK_ID = 'testnet'

app.post('/', async (req: Request, res: Response) => {
        const serializedTx: Buffer = req.body;
        const deserializedTx: SignedDelegate = deserialize(SCHEMA.SignedDelegate, Buffer.from(serializedTx)) as SignedDelegate;
        const relayerAccount: Account = await getAccount(NETWORK_ID, RELAYER_ID, RELAYER_PRIVATE_KEY);
        
        const receipt = await relayerAccount.signAndSendTransaction({
            actions: [actionCreators.signedDelegate(deserializedTx)],
            receiverId: deserializedTx.delegateAction.senderId
        });
        
        res.json({ message: 'Relayed', data: receipt });   
});


app.listen(3000, () => {
    console.log(`Relayer is running on port 3000`);
});