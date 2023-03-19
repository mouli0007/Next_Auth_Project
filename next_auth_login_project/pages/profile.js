import UserProfile from "../components/profile/user-profile";
import { getSession } from "next-auth/client";

function ProfilePage() {
  return <UserProfile />;
}

export default ProfilePage;

export const getServerSideProps = async (context) => {
  //  checking with the get session wheather the sessions is available
  const session = await getSession({
    req: context.req,
  });

  // If the session is not available we are redirecting it to the main home page
  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  //
  return {
    props: {
      session,
    },
  };
};
