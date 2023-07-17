import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
          <div id="dialog-root" />
          <div id="popover-root" />
          <div id="alert-root" />
        </body>
      </Html>
    )
  }
}

export default MyDocument
