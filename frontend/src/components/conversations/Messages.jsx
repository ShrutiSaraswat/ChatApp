import React, { useState, useEffect } from "react";
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
  const isImage = props.message.startsWith("data:image"); // Check if message is an image URL
  const isAudioBase64 = props.message.startsWith("data:audio"); // Check if message is a base64 audio

  const [speech, setspeech] = useState(false);
  const [pauseSpeech, setPauseSpeech] = useState(false);

  const handleSpeech = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = props.message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
    setspeech(true);
  };
  const [audioURL, setAudioURL] = useState(null);

  useEffect(() => {
    if (isAudioBase64) {
      // Convert base64 to Blob and then to a URL
      const byteCharacters = atob(props.message.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/webm" }); // Ensure the correct MIME type is used
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    }
  }, [props.message, isAudioBase64]);

  return (
    <div className={styles.messageMain}>
      <div className={styles.messagesM}>
        {selectedConversation._id === props.receiverId ? (
          // Render sender's messages on the right
          <div className={styles.messages}>
            <div className={styles.messagesSub}>
              {isImage ? (
                // Display image message
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
                    // Show enlarged image on click
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
              ) : isAudioBase64 ? (
                // Display audio message
                <div className={styles.audioContainer}>
                  <audio controls src={audioURL} /> {/* Audio player */}
                </div>
              ) : (
                // Display text message
                <div className={styles.messagesData}>{props.message}</div>
              )}
              <div className={styles.bottomInfo}>
                {!isImage && !isAudioBase64 ? (
                  // Button to read out loud text messages
                  <button onClick={handleSpeech} className={styles.listen}>
                    <span
                      role="img"
                      aria-label="Speaker"
                      style={{ marginRight: "5px" }}
                    >
                      🔊
                    </span>
                    {speech ? "Pause" : "Listen"}
                  </button>
                ) : (
                  ""
                )}
                {props.time}, {props.date} {/* Message timestamp */}
              </div>
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
          // Render recipient's messages on the left
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
                // Display image message
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
                    // Show enlarged image on click
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
              ) : isAudioBase64 ? (
                // Display audio message
                <div className={styles.audioContainer}>
                  <audio controls src={audioURL} /> {/* Audio player */}
                </div>
              ) : (
                // Display text message with different styling
                <div
                  className={styles.messagesData}
                  style={{ background: "#7839b7" }}
                >
                  {props.message}
                </div>
              )}
              <div className={styles.bottomInfo}>
                {!isImage && !isAudioBase64 ? (
                  // Button to read out loud text messages
                  <button onClick={handleSpeech} className={styles.listen}>
                    <span
                      role="img"
                      aria-label="Speaker"
                      style={{ marginRight: "5px" }}
                    >
                      🔊
                    </span>
                    Listen
                  </button>
                ) : (
                  ""
                )}
                {props.time}, {props.date} {/* Message timestamp */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
