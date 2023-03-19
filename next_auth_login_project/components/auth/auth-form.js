import { useState, useRef } from "react";
import classes from "./auth-form.module.css";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Couldnt Able to create a user !");
  }

  return data;
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();

  const emailInput = useRef();
  const passwordInput = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailInput.current.value;
    const enteredPassword = passwordInput.current.value;

    //  client Side Validation !

    if (isLogin) {
      // It will always resolves a promise
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });

      if (!result.error) {
        router.replace("/profile");
      }
    } else {
      // Creates a new User !
      try {
        const result = await createUser(enteredEmail, enteredPassword);
        console.log(result);
        console.log("User created");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInput} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordInput} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
