import Image from "next/image";
import styles from "./page.module.css";
import Dashboard from "@/src/Dashboard";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", width: "100vw" }}>
      <Dashboard />
    </main>
  );
}
