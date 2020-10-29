import React from "react";

interface LightSwitchProps extends React.SVGAttributes<SVGElement> {
  on?: boolean;
}

function LightSwitch({ on, ...props }: LightSwitchProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 185 185"
      height="100%"
      width="100%"
      fill="currentColor"
      {...props}
    >
      <title> Light Switch </title>
      {on ? (
        <path d="M130.11,57a0.74,0.74,0,0,0-.2-0.61v-0.2c-0.2-.2-0.2-0.61-0.4-0.81h0L114.36,40.18a3,3,0,0,0-1.82-.81H72.14a1.82,1.82,0,0,0-1,.2A3.18,3.18,0,0,0,69.72,41a1.82,1.82,0,0,0-.2,1V143a2.67,2.67,0,0,0,2.63,2.63h40.4a2.67,2.67,0,0,0,2.63-2.63V93.11l14.75-34.94h0a1.21,1.21,0,0,0,.2-0.81c0-.2.2-0.2,0-0.4C130.32,57.15,130.11,57.15,130.11,57ZM110.92,90.08H76l12.93-30.3h34.94ZM84.26,57.76l-9.7,22.42V48.06Zm37.37-3H88.3L78.2,44.63h33.33ZM74.77,140.57V95.13h35.35v45.45H74.77Z" />
      ) : (
        <path d="M130.17,128c0.2-.2,0-0.2,0-0.4a1.21,1.21,0,0,0-.2-0.81h0L115.22,91.89V42a2.67,2.67,0,0,0-2.63-2.63H72.2A2.67,2.67,0,0,0,69.57,42V143a1.82,1.82,0,0,0,.2,1,3.18,3.18,0,0,0,1.41,1.41,1.82,1.82,0,0,0,1,.2h40.4a3,3,0,0,0,1.82-.81l15.15-15.15h0c0.2-.2.2-0.61,0.4-0.81v-0.2a0.74,0.74,0,0,0,.2-0.61C130.17,127.85,130.37,127.85,130.17,128Zm-6.26-2.83H89L76,94.92H111ZM74.62,136.94V104.82l9.7,22.42Zm37,3.43H78.26l10.1-10.1h33.33Zm-1.41-95.94V89.87H74.82V44.43h35.35Z" />
      )}
      <path d="M168.18,185H16.82A16.84,16.84,0,0,1,0,168.18V16.82A16.84,16.84,0,0,1,16.82,0H168.18A16.84,16.84,0,0,1,185,16.82V168.18A16.84,16.84,0,0,1,168.18,185ZM16.82,5A11.83,11.83,0,0,0,5,16.82V168.18A11.83,11.83,0,0,0,16.82,180H168.18A11.83,11.83,0,0,0,180,168.18V16.82A11.83,11.83,0,0,0,168.18,5H16.82Z" />
    </svg>
  );
}

export default LightSwitch;
