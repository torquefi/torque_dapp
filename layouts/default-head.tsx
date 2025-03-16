import Head from 'next/head'

export function DefaultHead() {
  return (
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=0"
      />
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src *;
                        img-src * 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
                        style-src  'self' 'unsafe-inline' *"
      ></meta>
      <meta name="keywords" content="HTML, CSS, JavaScript" />
      <meta property="og:image" content={`https://uploads-ssl.webflow.com/6556f6be06fc2abb8a8da998/668e0c1fe2e01cba33b85485_torque.png`} />
      <meta name="twitter:image" content={`https://uploads-ssl.webflow.com/6556f6be06fc2abb8a8da998/668e0c1fe2e01cba33b85485_torque.png`} />
      <meta property="telegram:image" content={`https://uploads-ssl.webflow.com/6556f6be06fc2abb8a8da998/668e0c1fe2e01cba33b85485_torque.png`} />
      <link rel="shortcut icon" href="https://app.torque.fi/assets/logo.png" />
      <link rel="icon" type="image/png" href={'/favicon.png'} />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
  )
}
