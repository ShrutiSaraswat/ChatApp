import React, { useState } from "react";
import styles from "./messages.module.css";
import Image from "next/image";
import { useAuthContext } from "../context/AuthContext";
import { useConversation } from "../context/ConversationContext";
import useListenMessage from "../hooks/useListenMessage";
import { IoMdClose } from "react-icons/io";

const Messages = (props) => {
  const { authUser } = useAuthContext();
  useListenMessage();
  const { selectedConversation } = useConversation();

  const [imgOpen, setImgOpen] = useState(false);
  const isImage = props.message.startsWith("data:image");

  return (
    <div className={styles.messageMain}>
      <div className={styles.messagesM}>
        {selectedConversation._id === props.receiverId ? (
          <div className={styles.messages}>
            <div className={styles.messagesSub}>
              {isImage ? (
                <div className={styles.messagesSubImgMain}>
                  <div
                    className={styles.messagesSubImg}
                    onClick={() => {
                      setImgOpen(true);
                    }}
                  >
                    <img src={props.message} alt="message" />
                  </div>
                  {imgOpen && (
                    <div className={styles.displayImage}>
                      <IoMdClose
                        className={styles.closeButton}
                        onClick={() => {
                          setImgOpen(false);
                        }}
                      />
                      <img src={props.message} alt="img" />
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.messagesData}>{props.message}</div>
              )}
              {props.time}, {props.date}
            </div>
            <Image
              src={authUser.profilePic}
              className={styles.ProfileLogo}
              alt="img"
              width={42}
              height={42}
            />
          </div>
        ) : (
          <div
            className={styles.messages}
            style={{ justifyContent: "flex-start" }}
          >
            <Image
              src={selectedConversation.profilePic}
              className={styles.ProfileLogo}
              alt="img"
              width={42}
              height={42}
            />
            <div
              className={styles.messagesSub}
              style={{ alignItems: "flex-start" }}
            >
              {isImage ? (
                <div className={styles.messagesSubImgMain}>
                  <div
                    className={styles.messagesSubImg}
                    onClick={() => {
                      setImgOpen(true);
                    }}
                  >
                    <img src={props.message} alt="message" />
                  </div>
                  {imgOpen && (
                    <div className={styles.displayImage}>
                      <IoMdClose
                        className={styles.closeButton}
                        onClick={() => {
                          setImgOpen(false);
                        }}
                      />
                      <img src={props.message} alt="img" />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={styles.messagesData}
                  style={{ background: "#7839b7" }}
                >
                  {props.message}
                </div>
              )}
              {props.time}, {props.date}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
