"use client";
import React, { useState, useEffect } from "react";
import styles from "./singnUp.module.css";
import axiosInstance from "../Axios";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../components/context/AuthContext"; // Import useAuthContext

const SignupPage = () => {
  const { push } = useRouter();
  const router = useRouter();
  const { authUser, setAuthUser } = useAuthContext(); // Get setAuthUser from context

  const [error, setError] = useState("");
  const [checkError, setCheckError] = useState(false);
  const [inputs, setInputs] = useState({
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const handleRadioChange = (e) => {
    setInputs({ ...inputs, gender: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const seeError = handleError(inputs);
    setCheckError(seeError);
    if (!seeError) {
      setCheckError(true);
    } else {
      axiosInstance
        .post("/api/auth/signup", inputs)
        .then((res) => {
          const data = res.data;
          if (data) {
            localStorage.setItem("chat-user", JSON.stringify(data)); // Set user in local storage
            setAuthUser(data); // Update auth context
            console.log(authUser);
            alert("Signed Up Successfully!");
            // if (authUser) {
            push("/");
            // } else {
            //   push("/signUp");
            // }
          } else {
            alert("Failed to Sign Up!");
          }
        })
        .catch((error) => {
          console.error("Error signing up:", error);
          alert("An error occurred while signing up");
        });
    }
  };

  const handleError = ({
    fullName,
    userName,
    password,
    confirmPassword,
    gender,
  }) => {
    if (
      fullName === "" ||
      userName === "" ||
      password === "" ||
      confirmPassword === "" ||
      gender === ""
    ) {
      setError("Please fill all the fields");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return false;
    }

    return true;
  };

  useEffect(() => {
    console.log(authUser);
    if (authUser) {
      push("/");
    } else {
      push("/signUp");
    }
  }, [authUser, router]);

  return (
    <div className={styles.loginM}>
      <form onSubmit={handleSubmit}>
        <div className={styles.login}>
          <div className={styles.loginH}>Sign Up ChatApp</div>
          <div className={styles.loginSub}>
            <div className={styles.loginSubH}>Full Name</div>
            <input
              placeholder="Enter Full Name"
              type="text"
              value={inputs.fullName}
              onChange={(e) => {
                setInputs({ ...inputs, fullName: e.target.value });
              }}
            />
          </div>
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
          <div className={styles.loginSub}>
            <div className={styles.loginSubH}>Confirm Password</div>
            <input
              placeholder="Re-enter Password"
              type="password"
              value={inputs.confirmPassword}
              onChange={(e) => {
                setInputs({ ...inputs, confirmPassword: e.target.value });
              }}
            />
          </div>
          <div className={styles.radio}>
            <div className={styles.radioS}>
              <input
                type="radio"
                name="gender"
                value="male"
                id="male"
                checked={inputs.gender === "male"}
                onChange={handleRadioChange}
              />
              <label htmlFor="male" data-gender="male">
                Male
              </label>
            </div>
            <div className={styles.radioS}>
              <input
                type="radio"
                name="gender"
                value="female"
                id="female"
                checked={inputs.gender === "female"}
                onChange={handleRadioChange}
              />
              <label htmlFor="female" data-gender="female">
                Female
              </label>
            </div>
          </div>
          <a
            href="/login"
            className={styles.loginNot}
            style={{ color: "white" }}
          >
            Already have an account?
          </a>
          <button className={styles.loginButton}>Sign Up</button>
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

export default SignupPage;
