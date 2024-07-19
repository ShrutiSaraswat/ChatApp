import { React, useState, useEffect, useRef } from "react";
import styles from "./conversations.module.css";
import Image from "next/image";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { IoSend } from "react-icons/io5";
import { useAuthContext } from "../context/AuthContext";
import { useConversation } from "../context/ConversationContext";
import axiosInstance from "../../app/Axios";
import EmojiPicker from "emoji-picker-react";
import imageCompression from "browser-image-compression";
import { FaImage, FaMicrophone, FaStop } from "react-icons/fa6";
import { ReactMic } from "react-mic";
import ReactLoading from "react-loading";

const Conversations = () => {
  const { authUser } = useAuthContext();
  const { messages, setMessages, selectedConversation } = useConversation();
  const emojiPickerRef = useRef(null); // Ref for emoji picker
  const messagesEndRef = useRef(null); // Ref for the end of the messages container

  const [input, setInput] = useState(""); // Initial state as an empty string
  const [error, setError] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle emoji picker
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage && !audioURL) return;

    let messageContent = input;

    if (selectedImage) {
      messageContent = imagePreview;
    } else if (audioURL) {
      // Convert audio blob to base64
      const base64Audio = await convertBlobToBase64(recordedBlob.blob);
      messageContent = base64Audio;
    }

    axiosInstance
      .post(`/api/messages/send/${selectedConversation._id}`, {
        message: messageContent,
      })
      .then((res) => {
        setMessages([...messages, res.data]);
      })
      .catch((error) => {
        console.error("Failed to send message: ", error);
      });

    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setAudioURL(null);
  };

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 1, // Maximum file size in MB
        maxWidthOrHeight: 1920, // Max width or height
        useWebWorker: true, // Use web workers for faster compression
      };

      try {
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(compressedFile);
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing the image:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedConversation?._id) {
      axiosInstance
        .get(`/api/messages/${selectedConversation._id}`)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((err) => {
          if (err.response) {
            setError(err.response.data.message);
          }
        });
    }
  }, [selectedConversation?._id]);

  useEffect(() => {
    // Function to handle clicks outside emoji picker
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    // Add event listener for clicks outside emoji picker
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const formattedDate = `${day} ${month}`;

    return { time, formattedDate };
  };

  const startRecording = () => {
    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  const onData = (recordedData) => {
    console.log("recordedData", recordedData);
  };

  const onStop = (recordedBlob) => {
    console.log("recordedBlob", recordedBlob);
    setRecordedBlob(recordedBlob);
    setAudioURL(URL.createObjectURL(recordedBlob.blob));
  };

  return (
    <div>
      {selectedConversation?.isItSelected ? (
        <div className={styles.conversations}>
          <div className={styles.conversationsT}>
            <div className={styles.conversationsTR}>
              <Image
                src={selectedConversation.profilePic}
                className={styles.ProfileLogo}
                height={42}
                width={42}
                alt="img"
              />
              {selectedConversation.fullName}
            </div>
            <div className={styles.conversationsTL}>select language</div>
          </div>
          <hr />
          {messages.length ? (
            <div className={styles.conversationsMi}>
              {messages.map((messageObj, index) => (
                <Messages
                  key={index}
                  message={messageObj.message}
                  senderId={messageObj.senderId}
                  receiverId={messageObj.receiverId}
                  time={formatDateTime(messageObj.createdAt).time}
                  date={formatDateTime(messageObj.createdAt).formattedDate}
                />
              ))}
              <div ref={messagesEndRef} />{" "}
              {/* This div will ensure scrolling to the bottom */}
            </div>
          ) : (
            <div className={styles.conversationsMiS}>
              <div className={styles.startConv}>
                🤩 Start Conversation with {selectedConversation.fullName} now
                👋
              </div>
            </div>
          )}

          <hr />
          <form onSubmit={handleSubmit}>
            {audioURL && (
              <div className={styles.audioPreview}>
                <audio controls src={audioURL} />
                <button
                  onClick={() => setAudioURL(null)}
                  style={{
                    background: "red",
                    outline: "none",
                    border: "none",
                    color: "white",
                    padding: "5px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            <div className={styles.conversationsBM}>
              <div className={styles.conversationsB}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={styles.emojiButton}
                >
                  😀
                </button>
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className={styles.emojiPickerWrapper}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                {recording ? (
                  <div
                    style={{
                      color: "red",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <div>Recording</div>
                    <div>
                      <ReactLoading
                        type="bars"
                        color="red"
                        height={35}
                        width={35}
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Type message here..."
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                  />
                )}
                {!recording ? (
                  <label
                    htmlFor="image-upload"
                    className={styles.imageUploadLabel}
                  >
                    <FaImage style={{ color: "black" }} />
                  </label>
                ) : (
                  <></>
                )}

                <input
                  type="file"
                  id="image-upload"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <div className={styles.imagePreviewS}>
                      <img src={imagePreview} alt="Image preview" />
                    </div>

                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div className={styles.recordingButtons}>
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={recording}
                    className={styles.recordingButton}
                  >
                    <FaMicrophone color={!recording ? "blue" : "gray"} />
                  </button>
                  <button
                    type="button"
                    onClick={stopRecording}
                    disabled={!recording}
                    className={styles.recordingButton}
                  >
                    <FaStop color={recording ? "red" : "gray"} />
                  </button>
                </div>
              </div>
              <div className={styles.sendBtn}>
                <button type="submit">
                  <IoSend
                    style={{
                      cursor: "pointer",
                      fontSize: "25px",
                      padding: "10px",
                      background: "blue",
                      borderRadius: "50%",
                    }}
                    onClick={handleSubmit}
                  />
                </button>
              </div>
            </div>
          </form>
          <ReactMic
            record={recording}
            onStop={onStop}
            onData={onData}
            // strokeColor="#000000"
            // backgroundColor="#FF4081"
            className={styles.soundWaveDisplay}
          />
        </div>
      ) : (
        <div className={styles.chatNotOpenM}>
          <div className={styles.chatNotOpen}>
            <div className={styles.chatNotOpenS}>
              Welcome 👋 {authUser.fullName}!
            </div>
            <div className={styles.chatNotOpenS}>
              Select a chat to start messaging
            </div>
            <TiMessages style={{ fontSize: "60px" }} />
            <div className={styles.chatNotOpenD}>
              WhatsApp is an instant messaging and voice-over-IP service owned
              by technology conglomerate Meta. It allows users to send text,
              voice messages and video messages, make voice and video calls, and
              share images, documents, user locations, and other content.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;
