import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import "../styles/editorStyles.css";
import * as Toast from "@radix-ui/react-toast";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Toast.Provider>
        <Component {...pageProps} />
      </Toast.Provider>
    </SessionProvider>
  );
}

export default MyApp;
