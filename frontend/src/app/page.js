"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomePg from "@/components/homePg/HomePg";
import styles from "./page.module.css";
import { useAuthContext } from "@/components/context/AuthContext"; // Import useAuthContext

export default function Home() {
  const { authUser } = useAuthContext(); // Get authUser from context
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/login"); // Redirect to sign-up page if user is not authenticated
    } else {
      router.push("/");
      // console.log(authUser);
    }
  }, [authUser, router]);

  if (!authUser) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className={styles.home}>
      <HomePg />
    </div>
  );
}
