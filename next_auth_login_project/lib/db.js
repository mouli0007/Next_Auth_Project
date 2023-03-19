import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://mouli:Iq1wCAr3ODmj0F1W@cluster0.nprpz.mongodb.net/auth-demo?retryWrites=true&w=majority"
  );

  return client; 
}
