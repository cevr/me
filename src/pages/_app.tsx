import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "preflight.css";

import "@styles/global.css";
import { Layout } from "@layouts/index";
import { Nav, Footer } from "@components/index";

function App({ Component, pageProps }: AppProps) {
  let router = useRouter();
  return (
    <Layout home={router.asPath === "/"}>
      <Nav />
      <Component {...pageProps} />
      <Footer />
    </Layout>
  );
}

export default App;
