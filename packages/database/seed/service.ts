/* eslint-disable turbo/no-undeclared-env-vars */
import { MongoClient } from "mongodb";
import { connect } from "./connection";

const CLUSTER_2_URI = `${process.env.DB_URI_CLUSTER_2_READONLY}`;
const LOCAL_URI = `${process.env.DB_LOCAL || "mongodb://localhost:27017"}`;

export enum Database {
  Revolution = "revolution",
}

type Cluster = "cluster2" | "local";

export class SeedService {
  private connections: Record<Cluster, MongoClient | null> = {
    cluster2: null,
    local: null,
  };

  async connect() {
    this.connections.cluster2 = await connect(CLUSTER_2_URI);
    console.log("Connected to cluster 2");

    if (!LOCAL_URI.includes("localhost")) {
      throw new Error("LOCAL_URI env variable must be localhost!");
    }

    this.connections.local = await connect(LOCAL_URI);
    console.log("Connected to local");
  }

  async disconnect() {
    Object.values(this.connections).map(connection => connection?.close());
  }

  async syncCollection(
    database: Database,
    collection: string,
    filter: object | ((service: SeedService) => Promise<object>) = {},
  ) {
    console.time(`Seed ${database}.${collection}`);

    const conditions = typeof filter === "object" ? filter : await filter(this);

    const data = await this.getRemoteCollection(database, collection)?.find(conditions).toArray();

    if (data && data?.length > 0) {
      await this.updateLocalCollection(database, collection, data);
    }

    console.timeEnd(`Seed ${database}.${collection}`);
  }

  public getRemoteCollection(database: Database, collection: string) {
    return this.getRemoteConnection(database)?.db(database).collection(collection);
  }

  private getRemoteConnection(database: Database) {
    switch (database) {
      case Database.Revolution:
        return this.connections.cluster2;
      default:
        throw new Error("Invalid database");
    }
  }

  private async updateLocalCollection(database: Database, collection: string, data: any) {
    await this.connections.local?.db(database).collection(collection).deleteMany();

    await this.connections.local
      ?.db(database)
      .collection(collection)
      .bulkWrite(data.map((document: any) => ({ insertOne: { document } })));
  }
}
