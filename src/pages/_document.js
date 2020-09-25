import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <Head />
        <body>
          <Main />
          <script src="/check-theme-preference.js" async></script>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
