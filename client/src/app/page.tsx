import Image from "next/image";
import styles from "./page.module.css";
import TimeBox from "./componets/ui/TimeBox";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <TimeBox />
      </main>
    </div>
  );
}
