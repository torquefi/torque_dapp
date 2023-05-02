import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* <script src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"></script>
          <script>var vConsole = new window.VConsole();</script> */}
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="dialog-root"></div>
          <div id="popover-root"></div>
          <div id="alert-root"></div>
        </body>
      </Html>
    )
  }
}

export default MyDocument
