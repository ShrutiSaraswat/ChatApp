import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "../components/context/AuthContext";
import { ConversationProvider } from "@/components/context/ConversationContext";
import { SocketContextProvider } from "@/components/context/SocketContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatApp",
  description: "My ChatApp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <ConversationProvider>
            <SocketContextProvider>{children}</SocketContextProvider>
          </ConversationProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
