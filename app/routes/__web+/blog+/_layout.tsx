import { Outlet } from "@remix-run/react";

export default function Screen() {
  return (
    <main
      style={{
        gridArea: "content",
      }}
      className="mx-auto w-full md:w-[100ch]"
    >
      <Outlet />
    </main>
  );
}
