import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "../../../../lib/auth";
import { connectToDatabase } from "../../../../lib/db";

async function handler(req, res) {
  //   Only has to be PATCH Request
  if (req.method !== "PATCH") {
    return;
  }

  // Getting the session of a logged in user
  const session = await getSession({ req: req });

  //  Validating the session is true wheather the user is logged in or not
  if (!session) {
    res.status(401).json({ message: "Not Authenticated" });
    return;
  }

  // Getting the Datas we need !

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPAssword = req.body.newPassword;

  // Connecting to Database
  const client = await connectToDatabase();

  // Accessing the Collection
  const userCollection = client.db().collection("users");

  // Finding a user
  const user = await userCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "USer Not Found" });
    client.close();
    return;
  }

  const currentPassword = user.password;

  // Verifying the old database password
  const passwordMatch = await verifyPassword(oldPassword, currentPassword);

  if (!passwordMatch) {
    res.status(403).json({ message: "Password dosent Match" });
    client.close();
    return;
  }

  // Function for making the password as hashed password

  const hashedPassword = await hashPassword(newPAssword);

  // Updating the Database
  const result = await userCollection.updateOne(
    { email: userEmail },
    {
      $set: { password: hashedPassword },
    }
  );
    client.close();
    res.status(200).json({message:'Password Updated'})
}

export default handler;
