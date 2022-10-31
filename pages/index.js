import { violet, whiteA } from "@radix-ui/colors";
import { styled } from "@stitches/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Grid, Header, Container } from "semantic-ui-react";
import { StyledButton } from "../components/Button";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";

const StyledHeader = styled(Header, {
  color: whiteA.whiteA12,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>note-onn | Take notes anywhere!</title>
      </Head>
      <Navbar />
      <main className={styles.mainBody}>
        <Grid centered className={styles.grid} columns={2} stackable>
          <Grid.Row verticalAlign="middle">
            <Grid.Column>
              <div className={styles.svgImage}>
                <Image
                  alt="image of a person writing few notes"
                  src="/taking_notes.svg"
                  fill={true}
                />
              </div>
            </Grid.Column>
            <Grid.Column>
              <Container>
                <StyledHeader as="h1" inverted>
                  Note-Onn!
                </StyledHeader>
                <p style={{ color: whiteA.whiteA11 }}>
                  Write, store your notes online and access them on any
                  platform!
                </p>
                <StyledButton style={{ margin: "8px 8px 8px 0px" }}>
                  <Link style={{ color: "inherit" }} href="/editor">
                    Get Started!
                  </Link>
                </StyledButton>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </main>
      <Footer />
    </>
  );
}
