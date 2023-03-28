import { Outlet } from "@remix-run/react";

export default function Screen() {
  return (
    <main
      style={{
        gridArea: "content",
      }}
      className="w-full pt-12 md:w-[100ch] m-auto"
    >
      <Outlet />
    </main>
  );
}
