import { Outlet } from '@remix-run/react';

import { Footer, Nav } from '~/components';

export default function WebLayout() {
  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}
