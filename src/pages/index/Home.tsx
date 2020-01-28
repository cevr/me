import React from 'react';
import Head from 'next/head';

import { Nav } from 'components';

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Nav />

    <h1 className="text-5xl font-bold text-purple-500">Hello world!</h1>
  </div>
);

export default Home;
