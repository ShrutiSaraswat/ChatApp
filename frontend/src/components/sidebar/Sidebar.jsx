"use client";
import React, { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import ChatList from "./ChatList";
import { BiSearchAlt } from "react-icons/bi";
import axiosInstance from "../../app/Axios";
import { getRandomEmoji } from "../utils/emojis";

const Sidebar = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/api/users/")
      .then((e) => {
        console.log("content = ", e.data);
        setData(e.data);
      })
      .catch((err) => {
        console.log("error", err);
        if (err.response) {
          setError(err.response.data.message);
        }
      });
  }, []);

  return (
    <div className={styles.sidebarM}>
      <div className={styles.sidebarH}>Chats</div>
      <hr />
      <div className={styles.sidebarMi}>
        <input
          type="searchbar"
          placeholder="Search Contacts here..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <BiSearchAlt
          style={{
            fontSize: "20px",
            background: "blue",
            padding: "5px",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />
      </div>
      <hr />

      <div
        className={styles.sidebarBS}
        style={{
          boxShadow: "0 0px 5px lightblue",
        }}
      >
        {data.map((info) => {
          if (input === info.fullName) {
            return (
              <div
                key={info._id}
                style={{ fontWeight: "600", color: "lightgreen" }}
              >
                <ChatList
                  fullName={info.fullName}
                  profilePic={info.profilePic}
                  emoji={getRandomEmoji()}
                  id={info._id}
                />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div
        className={styles.sidebarB}
        style={{ color: input === "" ? "white" : "rgba(173, 216, 230, 0.811)" }}
      >
        {data.map((info) => {
          return (
            <div key={info._id}>
              <ChatList
                fullName={info.fullName}
                profilePic={info.profilePic}
                emoji={getRandomEmoji()}
                id={info._id}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
