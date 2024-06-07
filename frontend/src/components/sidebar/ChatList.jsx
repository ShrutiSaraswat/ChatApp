import React from "react";
import styles from "./chatList.module.css";
import Image from "next/image";
import avatar from "../assets/avatar.jpg";
import { useConversation } from "../context/ConversationContext";
import { useSocketContext } from "../context/SocketContext";

const ChatList = (props) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  const isSelected = selectedConversation?._id === props.id;
  const isOnline = onlineUsers.includes(props.id); // Check if user is online
  // console.log("Online Users: ", onlineUsers);

  const handleClick = () => {
    setSelectedConversation({
      _id: props.id,
      fullName: props.fullName,
      profilePic: props.profilePic,
      isItSelected: "true",
    });
  };

  return (
    <div className={styles.chatList}>
      <div
        className={styles.chatListSubM}
        style={{
          background: isSelected ? "rgb(147, 147, 255)" : "",
          borderRadius: isSelected ? "10px" : "",
          color: isSelected ? "black" : "",
        }}
        onClick={handleClick}
      >
        <div className={styles.chatListSub}>
          <Image
            src={props.profilePic || avatar}
            className={styles.ProfileLogo}
            height={38}
            width={38}
            alt="img"
            style={{
              border: isOnline ? "solid 2px black" : "solid 2px black",
              outline: isOnline ? "solid 2px lightgreen" : "solid 2px red",
            }}
          />
          {props.fullName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isOnline ? (
            <div
              style={{
                color: "lightgreen",
                padding: "3px 5px",
                background: "black",
                borderRadius: "30px",
                fontSize: "12px",
              }}
            >
              Online
            </div>
          ) : (
            ""
          )}
          {props.emoji}
        </div>
      </div>
      <hr />
    </div>
  );
};

export default ChatList;
