"use client";
import React, { useState, useEffect } from "react";
import styles from "./login.module.css";
import axiosInstance from "../Axios";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../components/context/AuthContext"; // Import useAuthContext

const LoginPage = () => {
  const { push } = useRouter();
  const router = useRouter();
  const { authUser, setAuthUser } = useAuthContext(); // Get setAuthUser from context

  const [error, setError] = useState("");

  const [checkError, setCheckError] = useState(false);

  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const seeError = handleError(inputs);
    setCheckError(seeError);

    if (!seeError) {
      setCheckError(true);
    } else {
      axiosInstance
        .post("/api/auth/login", inputs)
        .then((res) => {
          const data = res.data;
          if (data) {
            localStorage.setItem("chat-user", JSON.stringify(data)); // Set user in local storage
            setAuthUser(data); // Update auth context
            console.log(authUser, data);
            alert("Logged In Successfully!");
            push("/");
          } else {
            alert("Failed to Log In!");
          }
        })
        .catch((error) => {
          console.error("Error LogIn:", error);
          alert("An error occurred while logging in");
        });
    }
  };

  const handleError = ({ userName, password }) => {
    if (userName === "" || password === "") {
      setError("Please fill all the fields");
      return false;
    }
    return true;
  };

  useEffect(() => {
    console.log(authUser);
    if (authUser) {
      push("/");
    } else {
      push("/login");
    }
  }, [authUser, router]);

  return (
    <div className={styles.loginM}>
      <form onSubmit={handleSubmit}>
        <div className={styles.login}>
          <div className={styles.loginH}>Login ChatApp</div>
          <div className={styles.loginSub}>
            <div className={styles.loginSubH}>Username</div>
            <input
              placeholder="Enter Username"
              type="text"
              value={inputs.userName}
              onChange={(e) => {
                setInputs({ ...inputs, userName: e.target.value });
              }}
            />
          </div>
          <div className={styles.loginSub}>
            <div className={styles.loginSubH}>Password</div>
            <input
              placeholder="Enter Password"
              type="password"
              value={inputs.password}
              onChange={(e) => {
                setInputs({ ...inputs, password: e.target.value });
              }}
            />
          </div>
          <a
            href="/signUp"
            className={styles.loginNot}
            style={{ color: "white" }}
          >
            Don&apos;t have an account?
          </a>
          <button className={styles.loginButton}>Login</button>
        </div>
      </form>
      {checkError ? (
        <div
          className={styles.errorMsg}
          style={{ display: checkError ? "flex" : "none" }}
        >
          <div className={styles.errMsg}>
            <div>{error}</div>

            <button
              onClick={() => {
                setCheckError(false);
              }}
            >
              Ok Got it!
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LoginPage;
