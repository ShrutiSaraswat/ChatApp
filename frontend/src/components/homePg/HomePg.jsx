"use client";
import React, { useState } from "react";
import styles from "./homePg.module.css";
import Sidebar from "../sidebar/Sidebar";
import Conversations from "../conversations/Conversations";
import Image from "next/image";
import avatar from "../assets/avatar.jpg";
import { RiLogoutBoxRLine } from "react-icons/ri";
import axiosInstance from "../../app/Axios";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { useConversation } from "../context/ConversationContext";

const HomePg = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const { setSelectedConversation } = useConversation();
  const { push } = useRouter();

  const [logout, setLogout] = useState(false);

  const logoutFunc = () => {
    axiosInstance
      .post("/api/auth/logout")
      .then(() => {
        localStorage.removeItem("chat-user");
        setAuthUser(null);
        setSelectedConversation(null);
        alert("Logged Out Successfully!");
        if (!authUser) {
          push("/login");
        }
      })
      .catch((error) => {
        console.error("Error LogOut:", error);
        alert("An error occurred while LogOut");
      });
  };

  return (
    <div className={styles.homeM}>
      <div className={styles.home}>
        <div className={styles.homeTop}>
          <div className={styles.homeTopL}>
            <Image
              src={authUser.profilePic}
              className={styles.ProfileLogo}
              width={42}
              height={42}
              alt="img"
            />
            <div>{authUser.fullName}</div>
          </div>
          <div className={styles.homeTopR}>
            <div
              onClick={() => {
                setLogout(true);
              }}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              Logout <RiLogoutBoxRLine style={{ fontSize: "24px" }} />
            </div>

            {logout ? (
              <div className={styles.logoutPopup}>
                <div>Are you sure you want to Logout?</div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <button
                    onClick={() => {
                      setLogout(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      logoutFunc();
                    }}
                    style={{ background: "rgb(231, 0, 0)" }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className={styles.homeBottom}>
          <div className={styles.homeSidebar}>
            <Sidebar />
          </div>
          <hr />
          <div className={styles.homeCoversation}>
            <Conversations />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePg;
