import NextAuth from "next-auth/next";
import Providers from "next-auth/providers";
import { connectToDatabase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";
//  It Returns a new handler function function
export default NextAuth({

  // Default 
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      //  authorize method is called when it recives an incomming login request
      async authorize(credentials) {
        // We are checking with our datase base
        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");

        // Checking if the user is available or not
        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();

          throw new Error("No User Found");
        }

        // It returns a Boolean
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could Not Log You in ");
        }

        //  We return a object if everytihng is ok and then we encode
        //this in JSON web token
        client.close();


        return {
          email: user.email,
        };
      },
    }),
  ],
});
