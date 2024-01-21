import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { Footer, Nav } from "~/components";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  let oneYear = 1000 * 60 * 60 * 24 * 365;
  return json(
    { date: new Date() },
    {
      headers: {
        "Cache-Control": `max-age=${oneYear}`,
      },
    },
  );
};

export default function WebLayout() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <Nav />
      <Outlet />
      <Footer date={data.date} />
    </>
  );
}
