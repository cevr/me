---
title: "Creating custom dev tools with MSW"
date: "10-24-2020"
---

If you've ever been in a situation where the API for a feature you're adding to your frontend is not ready, then [MSW](https://mswjs.io/) is for you.

At work this is often the case for me! I have been using MSW for integration testing but I never used it for developing because I was under the impression that it would intercept and reject any requests that weren't mocked.

I was wrong.

It doesn't reject unmocked requests, it just passes it along.

I thought back to Kent C. Dodd's post on [dev tools](https://kentcdodds.com/blog/make-your-own-dev-tools) and knew that dynamically mocking API's would really speed up my development workflow (it did).

Here's how I did it.

## Making sure it's dev only

```tsx
// App.tsx
const DevTools = React.lazy(() => import("./DevTools"));

function App() {
  return (
    <>
      <Routes />
      {process.env.NODE_ENV === "development" ? (
        <React.Suspense fallback={null}>
          <DevTools />
        </React.Suspense>
      ) : null}
    </>
  );
}
```

Tada! Haha it would be great if that was all, but this is how I made sure the dev tools only loaded within the development environment. A simple dynamic component with a `null` suspense fallback.

This is the actual `DevTools.tsx` implementation:

```tsx
// DevTools.tsx
import * as React from "react";
import { setupWorker, graphql } from "msw";

export const mockServer = setupWorker();

const mocks = {
  users: [
    graphql.query("GetUsers", (req, res, ctx) => {
      // return fake data
    }),
    graphql.query("GetUser", (req, res, ctx) => {
      // return fake data
    }),
  ],
};

function DevTools() {
  const [mocks, setMocks] = React.useState({});
  const mockServerReady = React.useRef(false);
  const activeMocks = React.useMemo(
    () =>
      Object.entries(mocks)
        // we filter out all unchecked inputs
        .filter(([, shouldMock]) => shouldMock)
        // since the map is an array of handlers
        // we want to flatten the array so that the final result isn't nested
        .flatMap(([key]) => mocks[key]),
    [mocks]
  );

  React.useEffect(() => {
    mockServer.start().then(() => {
      mockServerReady.current = true;
    });

    return () => {
      mockServer.resetHandlers();
      mockServer.stop();
    };
  }, []);

  React.useEffect(() => {
    if (mockServerReady.current) {
      flushMockServerHandlers();
    }
  }, [state.mock]);

  // if a checkbox was unchecked
  // we want to make sure that the mock server is no longer mocking those API's
  // we reset all the handlers
  // then add them to MSW
  function flushMockServerHandlers() {
    mockServer.resetHandlers();
    addHandlersToMockServer(activeMocks);
  }

  function addHandlersToMockServer(handlers) {
    mockServer.use(...handlers);
  }

  function getInputProps(name: string) {
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
      const apiToMock = event.target.name;
      const shouldMock = event.target.checked;

      setState((prevState) => ({
        ...prevState,
        [apiToMock]: shouldMock,
      }));
    }

    return {
      name,
      onChange,
      checked: state.mock[name] ?? false,
    };
  }

  return (
    <div>
      {Object.keys(mocks).map((mockKey) => (
        <div key={mockKey}>
          <label htmlFor={mockKey}>Mock {mockKey}</label>
          <input {...getInputProps(mockKey)} />
        </div>
      ))}
    </div>
  );
}
```

Let's break that down.

## Mock server

Inside the `DevTools.tsx` file, I initialize the mock server and I add a map of all the API's I want to be able to mock and assign it to `mocks`. In this example I'm using graphql, but you could easily replace that with whatever REST API you may be using.

```tsx
// DevTools.tsx
import { setupWorker, graphql } from "msw";

export const mockServer = setupWorker();

const mocks = {
  users: [
    graphql.query("GetUsers", (req, res, ctx) => {
      // return fake data
    }),
    graphql.query("GetUser", (req, res, ctx) => {
      // return fake data
    }),
  ],
};
```

## UI

I make a checkbox for every key within `mocks`.
The `getInputProps` initializes all the props for each checkbox. Each time a checkbox is checked, I'll update the state to reflect which API should be mocked.

```tsx
// DevTools.tsx

function DevTools() {
  const [mocks, setMocks] = React.useState({});

  function getInputProps(name: string) {
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
      const apiToMock = event.target.name;
      const shouldMock = event.target.checked;

      setState((prevState) => ({
        ...prevState,
        [apiToMock]: shouldMock,
      }));
    }

    return {
      name,
      onChange,
      checked: state.mock[name] ?? false,
    };
  }

  return (
    <div>
      {Object.keys(mocks).map((mockKey) => (
        <div key={mockKey}>
          <label htmlFor={mockKey}>Mock {mockKey}</label>
          <input {...getInputProps(mockKey)} />
        </div>
      ))}
    </div>
  );
}
```

## Dynamic API Mocking

This part has a little more to unpack.

```tsx
// DevTools.tsx
export const mockServer = setupWorker();

function DevTools() {
  const [mocks, setMocks] = React.useState({});
  const mockServerReady = React.useRef(false);
  const activeMocks = React.useMemo(
    () =>
      Object.entries(mocks)
        .filter(([, shouldMock]) => shouldMock)
        .flatMap(([key]) => mocks[key]),
    [mocks]
  );

  React.useEffect(() => {
    mockServer.start().then(() => {
      mockServerReady.current = true;
    });

    return () => {
      mockServer.resetHandlers();
      mockServer.stop();
    };
  }, []);

  React.useEffect(() => {
    if (mockServerReady.current) {
      flushMockServerHandlers();
    }
  }, [state.mock]);

  function flushMockServerHandlers() {
    mockServer.resetHandlers();
    addHandlersToMockServer(activeMocks);
  }

  function addHandlersToMockServer(handlers) {
    mockServer.use(...handlers);
  }
}
```

First we create a ref to track whether the mock server is ready.

```tsx {2}
function DevTools() {
  const mockServerReady = React.useRef(false);
}
```

Then we create a list of all the active mocks to pass into MSW.

```tsx {3-9}
function DevTools() {
  const mockServerReady = React.useRef(false);
  const activeMocks = React.useMemo(
    () =>
      Object.entries(mocks)
        .filter(([, shouldMock]) => shouldMock)
        .flatMap(([key]) => mocks[key]),
    [mocks]
  );
}
```

When the dev tools initialize, we want to start the server, and set the `mockServerReady` ref to `true`. When the it unmounts, we reset all the handlers and stop the server.

```tsx {11-20}
function DevTools() {
  const mockServerReady = React.useRef(false);
  const activeMocks = React.useMemo(
    () =>
      Object.entries(mocks)
        .filter(([, shouldMock]) => shouldMock)
        .flatMap(([key]) => mocks[key]),
    [mocks]
  );

  React.useEffect(() => {
    mockServer.start().then(() => {
      mockServerReady.current = true;
    });

    return () => {
      mockServer.resetHandlers();
      mockServer.stop();
    };
  }, []);
}
```

Finally, whenever we check a checkbox, we reset all the mocks and add whichever handlers are checked within `mocks`.

```tsx {22-26}
function DevTools() {
  const mockServerReady = React.useRef(false);
  const activeMocks = React.useMemo(
    () =>
      Object.entries(mocks)
        .filter(([, shouldMock]) => shouldMock)
        .flatMap(([key]) => mocks[key]),
    [mocks]
  );

  React.useEffect(() => {
    mockServer.start().then(() => {
      mockServerReady.current = true;
    });

    return () => {
      mockServer.resetHandlers();
      mockServer.stop();
    };
  }, []);

  React.useEffect(() => {
    if (mockServerReady.current) {
      flushMockServerHandlers();
    }
  }, [state.mock]);
}
```

That's all folks!
