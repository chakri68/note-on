import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import "../styles/editorStyles.css";
import * as Toast from "@radix-ui/react-toast";

function MyApp({ Component, pageProps }) {
  return (
    <Toast.Provider>
      <Component {...pageProps} />
    </Toast.Provider>
  );
}

export default MyApp;
