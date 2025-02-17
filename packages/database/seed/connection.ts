import { MongoClient } from "mongodb";

const connect = async (uri: string) => {
  try {
    //use ipv4 locally to fix ipv6 connection issues
    const client = new MongoClient(uri, { appName: "monorepo-data-seed", family: 4 });
    await client.connect();
    client.on("connect", (event: any) => {
      console.info(event);
    });
    return client;
  } catch (error) {
    console.error(error);
    throw "Could Not Connect to MongoDB";
  }
};

const disconnect = async (client: any) => {
  try {
    await client.close();
  } catch (error) {
    console.error({ error });
    throw "Could Not Close MongoDB Connection";
  }
};

export { connect, disconnect };
