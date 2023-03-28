import { Outlet } from "@remix-run/react";

export default function Screen() {
  return (
    <main
      style={{
        gridArea: "content",
      }}
      className="m-auto w-full pt-12 md:w-[100ch]"
    >
      <Outlet />
    </main>
  );
}
