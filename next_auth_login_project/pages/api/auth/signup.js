import { connectToDatabase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";
//
async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message: "Inalid Input Password - Check your email and password ",
      });
      return;
    }

    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection("users").findOne({
      email,
    });

    if (existingUser) {
      res.status(422).json({ message: "User Exist already" });
      client.close();
      return;
    }

    console.log("Is it working");
    const hashedPassword_ = await hashPassword(password);
    const result = db.collection("users").insertOne({
      email,
      password: hashedPassword_,
    });

    res.status(201), json({ message: "Created User" });
    client.close();
  }
}

export default handler;
