import { KeyPair, connect, keyStores, Account } from "near-api-js";

export async function getAccount(network: string, accountId: string, privateKey: string): Promise<Account> {

        // set up key store
        const myKeyStore = new keyStores.InMemoryKeyStore();

        await myKeyStore.setKey(network, accountId, KeyPair.fromString(privateKey));

        const config = {
            networkId: network,
            keyStore: myKeyStore,
            nodeUrl: `https://rpc.${network}.near.org`,
        };

        const myConnection =  await connect(config);
        return myConnection.account(accountId);
}