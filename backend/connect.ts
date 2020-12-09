import mongoose, { Connection } from "mongoose";

let conn: Connection | null = null;

const uri = process.env.MONGODB_URI ?? "";

export const getMongooseConnection = async (): Promise<mongoose.Connection> => {
  if (conn == null) {
    conn = mongoose.createConnection(uri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    await conn;
  }

  return conn;
};
