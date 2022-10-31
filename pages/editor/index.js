import Head from "next/head";
import { Header } from "semantic-ui-react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import NotesManager from "../../components/NotesManager";
import styles from "../../styles/Editor.module.css";

export default function Editor() {
  return (
    <>
      <Head>
        <title>note-onn | Editor</title>
      </Head>
      <Navbar />
      <main className={styles.main}>
        <Header as="h1">Welcome to the editor!</Header>
        <NotesManager />
      </main>
      <Footer />
    </>
  );
}
