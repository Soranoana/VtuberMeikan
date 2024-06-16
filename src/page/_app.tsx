import React from 'react';
import Head from 'next/head';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"
// import "../public/styles/globals.css";
import { SessionProvider } from 'next-auth/react';

function App({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <>
            <Head>
                <title>VTMeikan</title>
            </Head>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    );
}

export default App;
