import { MongoServerError } from "mongodb";
import { collectionConfig } from "./dbConfig";
import { SeedService } from "./service";

const run = async () => {
  const service = new SeedService();
  try {
    await service.connect();

    await Promise.all(
      collectionConfig.map(({ db, name, filter }) => service.syncCollection(db, name, filter)),
    );

    await service.disconnect();
    console.info("🫡 🫡 🫡   data synced from production to local successfully   🫡 🫡 🫡 ");
  } catch (error) {
    console.error(error instanceof MongoServerError ? error.message : error);
    console.error("🚩 🚩 🚩  Something went wrong during sync   🚩 🚩 🚩");
  } finally {
    await service.disconnect();
    process.exit();
  }
};

run();
