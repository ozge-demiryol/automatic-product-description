import {
  MongoClient,
  Db,
  Filter,
  Document,
  OptionalUnlessRequiredId,
  WithId,
  FindOptions,
} from "mongodb";

const uri = process.env.MONGO_URI!;
let client: MongoClient;
let db: Db;

async function connect(): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("MongoDB connected");
  }
  if (!db) {
    db = client.db(MongoDataManager.dbName);
  }
  return db;
}

export class MongoDataManager<T extends Document> {
  static dbName = "Product_Description_Generator";

  async find(
    collectionName: string,
    filter: Filter<T> = {},
    queryOptions: FindOptions = {}
  ): Promise<WithId<T>[]> {
    const db = await connect();
    return db
      .collection<T>(collectionName)
      .find(filter, queryOptions)
      .sort({ _id: -1 })
      .toArray();
  }

  async findOne(
    collectionName: string,
    filter: Filter<T>
  ): Promise<WithId<T> | null> {
    const db = await connect();
    return db.collection<T>(collectionName).findOne(filter);
  }

  async insertOne(
    collectionName: string,
    doc: OptionalUnlessRequiredId<T>
  ): Promise<WithId<T>> {
    const db = await connect();
    const result = await db.collection<T>(collectionName).insertOne(doc);
    return { _id: result.insertedId, ...doc } as WithId<T>;
  }

  async updateOne(
    collectionName: string,
    filter: Filter<T>,
    updatedDoc: Partial<T>
  ): Promise<boolean> {
    const db = await connect();
    const result = await db
      .collection<T>(collectionName)
      .updateOne(filter, { $set: updatedDoc });
    return result.modifiedCount > 0;
  }

  async deleteOne(collectionName: string, filter: Filter<T>): Promise<boolean> {
    const db = await connect();
    const result = await db.collection<T>(collectionName).deleteOne(filter);
    return result.deletedCount > 0;
  }

  async aggregate<T extends Document>(collectionName: string, pipeline: Document[]): Promise<T[]> {
    const db = await connect();
    return db.collection(collectionName).aggregate<T>(pipeline).toArray();
  }
}
