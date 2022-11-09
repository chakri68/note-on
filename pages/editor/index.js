import Head from "next/head";
import { Header } from "semantic-ui-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import NotesManager from "../../components/NotesManager";
import styles from "../../styles/Editor.module.css";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Editor() {
  const { data: session, status } = useSession();
  return (
    <>
      <Head>
        <title>note-onn | Editor</title>
      </Head>
      <Navbar />
      <main className={styles.main}>
        <Header as="h1">Welcome to the editor!</Header>
        <NotesManager
          signIn={signIn}
          signOut={signOut}
          authenticated={status === "authenticated"}
        />
      </main>
      <Footer />
    </>
  );
}
