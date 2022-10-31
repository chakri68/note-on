import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      All rights reserved{" "}
      <Link className="link" href="https://github.com/chakri68">
        chakri68
      </Link>
    </footer>
  );
}
