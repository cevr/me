var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// <stdin>
__export(exports, {
  assets: () => import_assets.default,
  entry: () => entry,
  routes: () => routes
});

// node_modules/.pnpm/@remix-run+dev@1.0.4/node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toModule(require("react"));

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_server = __toModule(require("react-dom/server"));
var import_remix = __toModule(require("remix"));
require("dotenv").config();
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = import_server.default.renderToString(/* @__PURE__ */ React.createElement(import_remix.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route-module:C:\Users\cvr\projects\me\app\root.tsx
var root_exports = {};
__export(root_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  action: () => action,
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_remix4 = __toModule(require("remix"));

// app/styles/dark.css
var dark_default = "/build/_assets/dark-DWLKCENK.css";

// app/styles/light.css
var light_default = "/build/_assets/light-N7YSC4QS.css";

// app/styles/root.css
var root_default = "/build/_assets/root-YA6ZIJHY.css";

// app/styles/nav.css
var nav_default = "/build/_assets/nav-ELKT5J7J.css";

// app/styles/footer.css
var footer_default = "/build/_assets/footer-VNNQNQUB.css";

// app/styles/boundary.css
var boundary_default = "/build/_assets/boundary-E2TSO63I.css";

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-66M6LKDG.css";

// app/components/CodeBlock.tsx
var import_prism_react_renderer = __toModule(require("prism-react-renderer"));
var theme = {
  plain: {
    color: "var(--fg)",
    backgroundColor: "var(--code-bg)",
    transition: "all var(--transition)",
    fontFamily: '"SFMono-Regular", monospace'
  },
  styles: [
    {
      types: [
        "prolog",
        "constant",
        "builtin",
        "function",
        "boolean",
        "number",
        "maybe-class-name"
      ],
      style: {
        color: "var(--code-func)"
      }
    },
    {
      types: ["punctuation", "symbol"],
      style: {
        color: "var(--code-punc)"
      }
    },
    {
      types: ["string", "char", "tag", "selector"],
      style: {
        color: "var(--code-string)"
      }
    },
    {
      types: ["keyword", "variable"],
      style: {
        color: "var(--code-keyword)"
      }
    },
    {
      types: ["comment"],
      style: {
        color: "var(--code-comment)"
      }
    },
    {
      types: ["attr-name"],
      style: {
        color: "var(--code-string)"
      }
    }
  ]
};
var RE = /{([\d,-]+)}/;
var calculateLinesToHighlight = (meta5) => {
  var _a;
  if (!RE.test(meta5)) {
    return () => false;
  }
  const lineNumbers = (_a = RE.exec(meta5)) == null ? void 0 : _a[1].split(`,`).map((v) => v.split(`-`).map((x) => parseInt(x, 10)));
  return (index) => {
    const lineNumber = index + 1;
    const inRange = lineNumbers == null ? void 0 : lineNumbers.some(([start, end]) => end ? lineNumber >= start && lineNumber <= end : lineNumber === start);
    return inRange;
  };
};
function CodeBlock(props) {
  const language = props.className ? props.className.replace(/language-/, "") : "markup";
  const shouldHighlightLine = calculateLinesToHighlight(props.metastring);
  return /* @__PURE__ */ React.createElement(import_prism_react_renderer.default, __spreadProps(__spreadValues({}, import_prism_react_renderer.defaultProps), {
    theme,
    code: props.children.trim(),
    language
  }), ({ className, style, tokens, getLineProps, getTokenProps }) => /* @__PURE__ */ React.createElement("pre", {
    className,
    style: __spreadProps(__spreadValues({}, style), {
      padding: "var(--grid-gap)",
      borderRadius: "0.5rem",
      overflow: "auto"
    })
  }, tokens.map((line, i) => {
    const lineProps = getLineProps({ line, key: i });
    if (shouldHighlightLine(i)) {
      lineProps.className = `${lineProps.className} highlight-line`;
    }
    return /* @__PURE__ */ React.createElement("div", __spreadValues({
      key: i
    }, lineProps), /* @__PURE__ */ React.createElement("span", {
      className: "line-number"
    }, i + 1), line.map((token, key) => /* @__PURE__ */ React.createElement("span", __spreadValues({
      key
    }, getTokenProps({ token, key })))));
  })));
}

// app/components/ExternalLink.tsx
function ExternalLink(props) {
  return /* @__PURE__ */ React.createElement("a", __spreadValues({
    target: "_blank",
    rel: "noopener noreferrer"
  }, props));
}

// app/components/Footer.tsx
var import_dayjs = __toModule(require("dayjs"));

// app/components/icons/Email.tsx
function Email() {
  return /* @__PURE__ */ React.createElement("svg", {
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    height: "100%",
    width: "100%",
    viewBox: "0 0 512 512"
  }, /* @__PURE__ */ React.createElement("title", null, "Email icon"), /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("path", {
    d: "M10.688,95.156C80.958,154.667,204.26,259.365,240.5,292.01c4.865,4.406,10.083,6.646,15.5,6.646\r\n				c5.406,0,10.615-2.219,15.469-6.604c36.271-32.677,159.573-137.385,229.844-196.896c4.375-3.698,5.042-10.198,1.5-14.719\r\n				C494.625,69.99,482.417,64,469.333,64H42.667c-13.083,0-25.292,5.99-33.479,16.438C5.646,84.958,6.313,91.458,10.688,95.156z"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M505.813,127.406c-3.781-1.76-8.229-1.146-11.375,1.542C416.51,195.01,317.052,279.688,285.76,307.885\r\n				c-17.563,15.854-41.938,15.854-59.542-0.021c-33.354-30.052-145.042-125-208.656-178.917c-3.167-2.688-7.625-3.281-11.375-1.542\r\n				C2.417,129.156,0,132.927,0,137.083v268.25C0,428.865,19.135,448,42.667,448h426.667C492.865,448,512,428.865,512,405.333\r\n				v-268.25C512,132.927,509.583,129.146,505.813,127.406z"
  })));
}
var Email_default = Email;

// app/components/icons/Github.tsx
function Github() {
  return /* @__PURE__ */ React.createElement("svg", {
    role: "img",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    height: "100%",
    width: "100%"
  }, /* @__PURE__ */ React.createElement("title", null, " GitHub icon "), /* @__PURE__ */ React.createElement("path", {
    d: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
  }));
}
var Github_default = Github;

// app/components/icons/LightSwitch.tsx
function LightSwitch(_a) {
  var _b = _a, { on } = _b, props = __objRest(_b, ["on"]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 185 185",
    height: "100%",
    width: "100%",
    fill: "currentColor"
  }, props), /* @__PURE__ */ React.createElement("title", null, " Light Switch "), on ? /* @__PURE__ */ React.createElement("path", {
    d: "M130.11,57a0.74,0.74,0,0,0-.2-0.61v-0.2c-0.2-.2-0.2-0.61-0.4-0.81h0L114.36,40.18a3,3,0,0,0-1.82-.81H72.14a1.82,1.82,0,0,0-1,.2A3.18,3.18,0,0,0,69.72,41a1.82,1.82,0,0,0-.2,1V143a2.67,2.67,0,0,0,2.63,2.63h40.4a2.67,2.67,0,0,0,2.63-2.63V93.11l14.75-34.94h0a1.21,1.21,0,0,0,.2-0.81c0-.2.2-0.2,0-0.4C130.32,57.15,130.11,57.15,130.11,57ZM110.92,90.08H76l12.93-30.3h34.94ZM84.26,57.76l-9.7,22.42V48.06Zm37.37-3H88.3L78.2,44.63h33.33ZM74.77,140.57V95.13h35.35v45.45H74.77Z"
  }) : /* @__PURE__ */ React.createElement("path", {
    d: "M130.17,128c0.2-.2,0-0.2,0-0.4a1.21,1.21,0,0,0-.2-0.81h0L115.22,91.89V42a2.67,2.67,0,0,0-2.63-2.63H72.2A2.67,2.67,0,0,0,69.57,42V143a1.82,1.82,0,0,0,.2,1,3.18,3.18,0,0,0,1.41,1.41,1.82,1.82,0,0,0,1,.2h40.4a3,3,0,0,0,1.82-.81l15.15-15.15h0c0.2-.2.2-0.61,0.4-0.81v-0.2a0.74,0.74,0,0,0,.2-0.61C130.17,127.85,130.37,127.85,130.17,128Zm-6.26-2.83H89L76,94.92H111ZM74.62,136.94V104.82l9.7,22.42Zm37,3.43H78.26l10.1-10.1h33.33Zm-1.41-95.94V89.87H74.82V44.43h35.35Z"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M168.18,185H16.82A16.84,16.84,0,0,1,0,168.18V16.82A16.84,16.84,0,0,1,16.82,0H168.18A16.84,16.84,0,0,1,185,16.82V168.18A16.84,16.84,0,0,1,168.18,185ZM16.82,5A11.83,11.83,0,0,0,5,16.82V168.18A11.83,11.83,0,0,0,16.82,180H168.18A11.83,11.83,0,0,0,180,168.18V16.82A11.83,11.83,0,0,0,168.18,5H16.82Z"
  }));
}
var LightSwitch_default = LightSwitch;

// app/components/icons/Star.tsx
function Star() {
  return /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 46.4 46.4",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
    fill: "currentColor",
    height: "100%",
    width: "100%"
  }, /* @__PURE__ */ React.createElement("title", null, "Star icon"), /* @__PURE__ */ React.createElement("path", {
    d: "M21.6 2c.3-.6.9-1 1.6-1 .7 0 1.3.4 1.6 1l5.8 11.7c.3.5.8.9 1.4 1l12.8 1.9c.7.1 1.2.6 1.4 1.2.2.6 0 1.4-.5 1.8l-9.3 9.1c-.4.4-.6 1-.5 1.6l2.2 12.9c.1.7-.2 1.4-.7 1.8-.6.4-1.3.5-1.9.1L24 39c-.5-.3-1.1-.3-1.7 0l-11.5 6.1c-.6.3-1.3.3-1.9-.1-.6-.4-.8-1.1-.7-1.8l2.2-12.9c.1-.6-.1-1.2-.5-1.6l-9.4-9c-.5-.5-.7-1.2-.5-1.8.2-.6.8-1.1 1.4-1.2l12.9-1.9c.6-.1 1.1-.5 1.4-1L21.6 2z"
  }));
}
var Star_default = Star;

// app/components/icons/Twitter.tsx
function Twitter() {
  return /* @__PURE__ */ React.createElement("svg", {
    role: "img",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    height: "100%",
    width: "100%"
  }, /* @__PURE__ */ React.createElement("title", null, " Twitter icon "), /* @__PURE__ */ React.createElement("path", {
    d: "M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"
  }));
}
var Twitter_default = Twitter;

// app/components/icons/LinkedIn.tsx
function LinkedIn() {
  return /* @__PURE__ */ React.createElement("svg", {
    role: "img",
    viewBox: "0 0 26 26",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    height: "100%",
    width: "100%"
  }, /* @__PURE__ */ React.createElement("title", null, "LinkedIn Icon"), /* @__PURE__ */ React.createElement("path", {
    d: "M 21.125 0 L 4.875 0 C 2.183594 0 0 2.183594 0 4.875 L 0 21.125 C 0 23.816406 2.183594 26 4.875 26 L 21.125 26 C 23.816406 26 26 23.816406 26 21.125 L 26 4.875 C 26 2.183594 23.816406 0 21.125 0 Z M 8.039063 22.070313 L 4 22.070313 L 3.976563 9.976563 L 8.015625 9.976563 Z M 5.917969 8.394531 L 5.894531 8.394531 C 4.574219 8.394531 3.722656 7.484375 3.722656 6.351563 C 3.722656 5.191406 4.601563 4.3125 5.945313 4.3125 C 7.289063 4.3125 8.113281 5.191406 8.140625 6.351563 C 8.140625 7.484375 7.285156 8.394531 5.917969 8.394531 Z M 22.042969 22.070313 L 17.96875 22.070313 L 17.96875 15.5 C 17.96875 13.910156 17.546875 12.828125 16.125 12.828125 C 15.039063 12.828125 14.453125 13.558594 14.171875 14.265625 C 14.066406 14.519531 14.039063 14.867188 14.039063 15.222656 L 14.039063 22.070313 L 9.945313 22.070313 L 9.921875 9.976563 L 14.015625 9.976563 L 14.039063 11.683594 C 14.5625 10.875 15.433594 9.730469 17.519531 9.730469 C 20.105469 9.730469 22.039063 11.417969 22.039063 15.046875 L 22.039063 22.070313 Z"
  }));
}
var LinkedIn_default = LinkedIn;

// app/components/Footer.tsx
var email = "hello@cvr.im";
function Footer({ date }) {
  return /* @__PURE__ */ React.createElement("footer", {
    className: "footer"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex gap-5 items-center"
  }, /* @__PURE__ */ React.createElement(ExternalLink, {
    className: "icon",
    href: "https://github.com/cevr",
    "aria-label": "Github profile",
    rel: "me"
  }, /* @__PURE__ */ React.createElement(Github_default, null)), /* @__PURE__ */ React.createElement(ExternalLink, {
    className: "icon",
    href: "https://twitter.com/_cristianvr_",
    "aria-label": "Twitter profile",
    rel: "me"
  }, /* @__PURE__ */ React.createElement(Twitter_default, null)), /* @__PURE__ */ React.createElement(ExternalLink, {
    className: "icon",
    href: "https://linkedin.com/in/cristianvr",
    "aria-label": "LinkedIn profile"
  }, /* @__PURE__ */ React.createElement(LinkedIn_default, null)), /* @__PURE__ */ React.createElement(ExternalLink, {
    className: "icon",
    href: `mailto:${email}?subject=Hi Cristian!`,
    "aria-label": "email",
    rel: "me"
  }, /* @__PURE__ */ React.createElement(Email_default, null))), /* @__PURE__ */ React.createElement("div", {
    className: "text-xs text-gray-400"
  }, "Rendered on ", (0, import_dayjs.default)(date).format("dddd, MMMM D YYYY [at] hh:mm A")));
}

// app/components/Nav.tsx
var import_clsx = __toModule(require("clsx"));
var import_remix2 = __toModule(require("remix"));
var import_react_router_dom = __toModule(require("react-router-dom"));
function Nav({ colorMode }) {
  let location = (0, import_react_router_dom.useLocation)();
  return /* @__PURE__ */ React.createElement("nav", {
    className: "nav"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(import_remix2.Link, {
    to: "/",
    className: (0, import_clsx.default)("logo", {
      active: location.pathname === "/"
    }),
    "aria-label": "logo",
    title: "Logo"
  }, "CVR"), /* @__PURE__ */ React.createElement(import_remix2.Link, {
    to: "/blog",
    className: (0, import_clsx.default)("item", {
      active: location.pathname.includes("blog")
    }),
    "aria-label": "blog",
    title: "blog"
  }, "Blog")), /* @__PURE__ */ React.createElement("form", {
    action: "/",
    method: "POST"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "switch",
    name: "colorMode",
    value: colorMode === "dark" ? "light" : "dark"
  }, /* @__PURE__ */ React.createElement(LightSwitch_default, {
    "aria-label": "Toggle Theme",
    on: colorMode === "light"
  }))));
}

// app/components/VerticalSpacer.tsx
var sizes = {
  sm: "0.5rem 0",
  md: "1rem 0",
  lg: "1.5rem 0"
};
function VerticalSpacer({ size = "md" }) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      margin: sizes[size]
    }
  });
}

// app/components/ButtonLink.tsx
function ButtonLink(_a) {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ React.createElement(ExternalLink, __spreadValues({
    className: "paragraph-link"
  }, props));
}

// app/lib/posts.ts
var posts_exports = {};
__export(posts_exports, {
  query: () => query
});
var import_gray_matter = __toModule(require("gray-matter"));
var stripWhitespace = (string) => {
  return string.replace(/^\s+/, "").replace(/\s+$/, "");
};
var wordCount = (string) => {
  let pattern = "\\w+";
  let reg = new RegExp(pattern, "g");
  return (string.match(reg) || []).length;
};
var humanReadableTime = (time) => {
  if (time < 1) {
    return "less than a minute";
  }
  return `${Math.ceil(time)} minute`;
};
var getReadEstimate = (content) => {
  let avergageWordsPerMinute = 225;
  content = stripWhitespace(content);
  let minutes = wordCount(content) / avergageWordsPerMinute;
  return humanReadableTime(minutes);
};
var normalizePost = (post) => {
  let { data, content } = (0, import_gray_matter.default)(post.body_markdown);
  return __spreadProps(__spreadValues({}, post), {
    slug: post.slug.split("-").slice(0, -1).join("-"),
    matter: { data, content },
    read_estimate: getReadEstimate(post.body_markdown)
  });
};
var fetchArticle = async (page) => fetch(`https://dev.to/api/articles/me/published?page=${page}&per_page=100`, {
  headers: {
    "api-key": process.env.DEV_TO_TOKEN
  }
}).then((res) => {
  if (res.status !== 200) {
    return Promise.reject(res.statusText);
  }
  return res.json();
}).catch((err) => {
  throw new Error(`error fetching page ${page}, ${err}`);
});
var fetchAllArticles = async (page = 1, results = []) => {
  let latestResults = await fetchArticle(page);
  if (latestResults.length === 100)
    return fetchAllArticles(page + 1, results.concat(latestResults));
  return results.concat(latestResults);
};
var query = async () => {
  let posts = (await fetchAllArticles()).map(normalizePost);
  return posts;
};

// app/lib/projects.ts
var projects_exports = {};
__export(projects_exports, {
  query: () => query2
});
var import_graphql_request = __toModule(require("graphql-request"));
var repositoriesQuery = import_graphql_request.gql`
  query {
    user(login: "cevr") {
      repositories(
        first: 25
        orderBy: { field: STARGAZERS, direction: DESC }
        isFork: false
        affiliations: [OWNER]
      ) {
        edges {
          node {
            description
            name
            stargazerCount
            url
            id
            primaryLanguage {
              name
            }
            isArchived
          }
        }
      }
    }
  }
`;
var client = new import_graphql_request.GraphQLClient("https://api.github.com/graphql", {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
  }
});
var query2 = () => client.request(repositoriesQuery).then((data) => {
  var _a, _b;
  return ((_b = (_a = data.user) == null ? void 0 : _a.repositories) == null ? void 0 : _b.edges.map((edge) => edge.node).filter((project) => project.stargazerCount > 1 && !project.isArchived)) ?? [];
}).catch(() => []);

// app/lib/cookies.ts
var import_remix3 = __toModule(require("remix"));
var colorModeCookie = (0, import_remix3.createCookie)("colorMode", {
  maxAge: 60 * 60 * 24 * 365,
  path: "/"
});

// route-module:C:\Users\cvr\projects\me\app\root.tsx
var import_react = __toModule(require("react"));
var links = () => {
  return [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png"
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png"
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png"
    },
    {
      rel: "manifest",
      href: "/manifest.json"
    },
    {
      rel: "stylesheet",
      href: tailwind_default
    },
    {
      rel: "stylesheet",
      href: dark_default
    },
    { rel: "stylesheet", href: root_default },
    { rel: "stylesheet", href: nav_default },
    { rel: "stylesheet", href: footer_default },
    { rel: "stylesheet", href: boundary_default }
  ];
};
var meta = () => {
  return {
    viewport: "width=device-width, initial-scale=1"
  };
};
var loader = async ({ request }) => {
  let value = await colorModeCookie.parse(request.headers.get("cookie")) ?? {};
  value.colorMode ?? (value.colorMode = null);
  return { date: new Date(), colorMode: value.colorMode };
};
var action = async ({ request }) => {
  let value = await colorModeCookie.parse(request.headers.get("cookie")) ?? {};
  let params = new URLSearchParams(await request.text());
  value.colorMode = params.get("colorMode") ?? value.colorMode ?? null;
  return (0, import_remix4.redirect)(request.headers.get("Referer") ?? "/", {
    headers: {
      "Set-Cookie": await colorModeCookie.serialize(value)
    }
  });
};
function App() {
  let data = (0, import_remix4.useLoaderData)();
  const colorMode = (0, import_react.useMemo)(() => {
    if (data.colorMode) {
      return data.colorMode;
    }
    if (typeof window !== "undefined") {
      let lightColorScheme = window.matchMedia("(prefers-color-scheme: light)");
      return data.colorMode ?? lightColorScheme.matches ? "light" : "dark";
    }
    return "dark";
  }, [data.colorMode]);
  return /* @__PURE__ */ React.createElement(Document, null, colorMode === "light" ? /* @__PURE__ */ React.createElement("link", {
    rel: "stylesheet",
    href: light_default
  }) : null, /* @__PURE__ */ React.createElement(Nav, {
    colorMode
  }), /* @__PURE__ */ React.createElement(import_remix4.Outlet, null), /* @__PURE__ */ React.createElement(Footer, {
    date: data.date
  }));
}
function CatchBoundary() {
  let caught = (0, import_remix4.useCatch)();
  switch (caught.status) {
    case 401:
    case 404:
      return /* @__PURE__ */ React.createElement(Document, {
        title: "Not found | Cristian"
      }, /* @__PURE__ */ React.createElement("main", {
        className: "boundary"
      }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, "Nope! This page definitely doesn't exist. Just checked."), /* @__PURE__ */ React.createElement("p", null, "Take this", " ", /* @__PURE__ */ React.createElement(import_remix4.Link, {
        to: "/",
        className: "link-home",
        "aria-label": "home link"
      }, "link"), " ", "back home"))));
    default:
      return /* @__PURE__ */ React.createElement(Document, {
        title: "Oops! | Cristian"
      }, /* @__PURE__ */ React.createElement("main", {
        className: "boundary"
      }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, "What??! Something went wrong you say?"), /* @__PURE__ */ React.createElement("p", null, "Click this", " ", /* @__PURE__ */ React.createElement(import_remix4.Link, {
        to: "/",
        className: "link-home",
        "aria-label": "home link"
      }, "link"), " ", "back home and pretend you never saw anything."))));
  }
}
function ErrorBoundary({ error }) {
  console.error(error);
  return /* @__PURE__ */ React.createElement(Document, {
    title: "Oops! | Cristian"
  }, /* @__PURE__ */ React.createElement("main", {
    className: "boundary"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, "What??! Something went wrong you say?"), /* @__PURE__ */ React.createElement("p", null, "Click this", " ", /* @__PURE__ */ React.createElement(import_remix4.Link, {
    to: "/",
    className: "link-home",
    "aria-label": "home link"
  }, "link"), " ", "back home and pretend you never saw anything."))));
}
function Document({
  children,
  title
}) {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("meta", {
    charSet: "utf-8"
  }), title ? /* @__PURE__ */ React.createElement("title", null, title) : null, /* @__PURE__ */ React.createElement(import_remix4.Meta, null), /* @__PURE__ */ React.createElement(import_remix4.Links, null)), /* @__PURE__ */ React.createElement("body", null, children, /* @__PURE__ */ React.createElement(import_remix4.Scripts, null), process.env.NODE_ENV === "development" && /* @__PURE__ */ React.createElement(import_remix4.LiveReload, null)));
}

// route-module:C:\Users\cvr\projects\me\app\routes\index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index,
  links: () => links2,
  loader: () => loader2,
  meta: () => meta2
});
var React2 = __toModule(require("react"));
var import_remix5 = __toModule(require("remix"));

// app/styles/index.css
var styles_default = "/build/_assets/index-ULWPB5V7.css";

// route-module:C:\Users\cvr\projects\me\app\routes\index.tsx
var meta2 = () => {
  return {
    title: "Me | Cristian",
    description: "I'm looking to do what I can with a keyboard at hand."
  };
};
var links2 = () => {
  return [
    {
      rel: "stylesheet",
      href: styles_default
    }
  ];
};
var loader2 = async ({ request }) => {
  const projects = await projects_exports.query();
  return {
    projects
  };
};
function Index() {
  let data = (0, import_remix5.useLoaderData)();
  return /* @__PURE__ */ React2.createElement("main", {
    className: "home"
  }, /* @__PURE__ */ React2.createElement("section", {
    className: "about"
  }, /* @__PURE__ */ React2.createElement(NameTitle, null), /* @__PURE__ */ React2.createElement("p", {
    className: "desc"
  }, "A growing developer with a heart of code. I have a passion for improvement, believing fully in ", /* @__PURE__ */ React2.createElement(KaizenLink, null), ". I'm looking to do what I can with a keyboard at hand. Cheesy, right?"), /* @__PURE__ */ React2.createElement("p", {
    className: "interests"
  }, "I specialize in", " ", /* @__PURE__ */ React2.createElement(ButtonLink, {
    href: "https://reactjs.org/"
  }, "React"), ", I'm a fan of ", /* @__PURE__ */ React2.createElement(ButtonLink, {
    href: "https://graphql.org/"
  }, "GraphQL"), ", I use", " ", /* @__PURE__ */ React2.createElement(ButtonLink, {
    href: "https://www.typescriptlang.org/"
  }, "Typescript"), " ", "daily, and I love", " ", /* @__PURE__ */ React2.createElement(ButtonLink, {
    href: "https://remix.run/"
  }, "Remix"), ".", /* @__PURE__ */ React2.createElement("br", null), "In fact,", " ", /* @__PURE__ */ React2.createElement(ButtonLink, {
    href: "https://github.com/cevr/me"
  }, "this website"), " ", "is built with all of them!")), /* @__PURE__ */ React2.createElement("section", {
    className: "projects"
  }, /* @__PURE__ */ React2.createElement("h2", null, " Projects "), data.projects.map((project) => {
    var _a;
    return /* @__PURE__ */ React2.createElement(ExternalLink, {
      href: project.url,
      "aria-label": project.name,
      key: project.id
    }, /* @__PURE__ */ React2.createElement("article", {
      className: "project"
    }, /* @__PURE__ */ React2.createElement("div", {
      className: "project-language"
    }, (_a = project.primaryLanguage) == null ? void 0 : _a.name), /* @__PURE__ */ React2.createElement("h1", {
      className: "project-name"
    }, project.name), /* @__PURE__ */ React2.createElement("p", {
      className: "project-description"
    }, project.description), /* @__PURE__ */ React2.createElement("div", {
      className: "project-stargazers"
    }, /* @__PURE__ */ React2.createElement("span", {
      className: "stargazers-star"
    }, /* @__PURE__ */ React2.createElement(Star_default, null)), project.stargazerCount)));
  })));
}
function NameTitle() {
  let [showFull, setShowFull] = React2.useState(false);
  React2.useEffect(() => {
    setTimeout(() => setShowFull(true), 1500);
  }, []);
  return /* @__PURE__ */ React2.createElement("h1", null, /* @__PURE__ */ React2.createElement("span", {
    className: "name"
  }, /* @__PURE__ */ React2.createElement("span", null, "C"), showFull ? /* @__PURE__ */ React2.createElement("span", {
    className: "animating-name first-name"
  }, "ristian ") : null), /* @__PURE__ */ React2.createElement("span", {
    className: "name"
  }, /* @__PURE__ */ React2.createElement("span", null, "V"), showFull ? /* @__PURE__ */ React2.createElement("span", {
    className: "animating-name first-family-name"
  }, "elasquez ") : null), /* @__PURE__ */ React2.createElement("span", {
    className: "name"
  }, /* @__PURE__ */ React2.createElement("span", null, "R"), showFull ? /* @__PURE__ */ React2.createElement("span", {
    className: "animating-name second-family-name"
  }, "amos") : null));
}
function KaizenLink() {
  let [hovered, setHovered] = React2.useState(false);
  return /* @__PURE__ */ React2.createElement(ButtonLink, {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    href: "https://en.wikipedia.org/wiki/Kaizen"
  }, hovered ? "kaizen" : `\u6539\u5584`);
}

// route-module:C:\Users\cvr\projects\me\app\routes\blog.tsx
var blog_exports = {};
__export(blog_exports, {
  default: () => Screen,
  links: () => links3
});
var import_remix6 = __toModule(require("remix"));

// app/styles/blog-layout.css
var blog_layout_default = "/build/_assets/blog-layout-VPI7H2FO.css";

// route-module:C:\Users\cvr\projects\me\app\routes\blog.tsx
function links3() {
  return [
    {
      rel: "stylesheet",
      href: blog_layout_default
    }
  ];
}
function Screen() {
  return /* @__PURE__ */ React.createElement("main", {
    className: "blog-layout"
  }, /* @__PURE__ */ React.createElement(import_remix6.Outlet, null));
}

// route-module:C:\Users\cvr\projects\me\app\routes\blog\$slug.tsx
var slug_exports = {};
__export(slug_exports, {
  default: () => Screen2,
  links: () => links4,
  loader: () => loader3,
  meta: () => meta3
});
var import_remix7 = __toModule(require("remix"));
var import_clsx2 = __toModule(require("clsx"));
var import_dayjs2 = __toModule(require("dayjs"));
var import_relativeTime = __toModule(require("dayjs/plugin/relativeTime"));
var import_serialize = __toModule(require("next-mdx-remote/serialize"));
var import_next_mdx_remote = __toModule(require("next-mdx-remote"));

// app/styles/blog-post.css
var blog_post_default = "/build/_assets/blog-post-Z477QP4C.css";

// route-module:C:\Users\cvr\projects\me\app\routes\blog\$slug.tsx
import_dayjs2.default.extend(import_relativeTime.default);
var meta3 = (props) => {
  var _a;
  return {
    title: `${(_a = props.data) == null ? void 0 : _a.title} | Cristian`
  };
};
function links4() {
  return [
    {
      rel: "stylesheet",
      href: blog_post_default
    }
  ];
}
var loader3 = async ({ params }) => {
  let posts = await posts_exports.query();
  let postIndex = posts.findIndex((post2) => post2.slug === (params == null ? void 0 : params.slug));
  if (postIndex === -1) {
    throw (0, import_remix7.json)({ message: "This post doesn't exist." }, { status: 404 });
  }
  let post = posts[postIndex];
  let olderPost = posts[postIndex + 1] ?? null;
  let newerPost = posts[postIndex - 1] ?? null;
  return {
    olderPost,
    newerPost,
    post: __spreadProps(__spreadValues({}, post), {
      content: await (0, import_serialize.serialize)(post.matter.content)
    })
  };
};
function Screen2() {
  const { post, newerPost, olderPost } = (0, import_remix7.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", {
    className: "post"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "date"
  }, (0, import_dayjs2.default)(post.published_at).format("MMMM DD, YYYY"), post.edited_at ? /* @__PURE__ */ React.createElement("span", {
    className: "edited"
  }, (0, import_dayjs2.default)().to(post.edited_at)) : null, /* @__PURE__ */ React.createElement("span", null, " | ", post.read_estimate, " read")), /* @__PURE__ */ React.createElement("h1", {
    className: "title"
  }, " ", post.title, " "), /* @__PURE__ */ React.createElement(VerticalSpacer, {
    size: "sm"
  }), /* @__PURE__ */ React.createElement("div", null, post.tag_list.map((tag) => /* @__PURE__ */ React.createElement("span", {
    key: tag,
    className: "tag"
  }, "#", tag))), /* @__PURE__ */ React.createElement(VerticalSpacer, {
    size: "lg"
  }), /* @__PURE__ */ React.createElement(import_next_mdx_remote.MDXRemote, __spreadProps(__spreadValues({}, post.content), {
    components
  })), /* @__PURE__ */ React.createElement(VerticalSpacer, {
    size: "lg"
  }), /* @__PURE__ */ React.createElement("nav", {
    className: "post-nav"
  }, olderPost ? /* @__PURE__ */ React.createElement(PostNavItem, {
    post: olderPost
  }) : /* @__PURE__ */ React.createElement("div", null), newerPost ? /* @__PURE__ */ React.createElement(PostNavItem, {
    post: newerPost,
    newer: true
  }) : /* @__PURE__ */ React.createElement("div", null)));
}
function PostNavItem({ post, newer }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: (0, import_clsx2.default)("post-nav-item", {
      newer
    })
  }, /* @__PURE__ */ React.createElement("div", {
    className: "post-nav-item-date"
  }, newer ? "Newer \u2192" : "\u2190 Older"), /* @__PURE__ */ React.createElement(import_remix7.Link, {
    to: `../${post.slug}`,
    className: "post-nav-item-title"
  }, post.title));
}
var components = {
  code: CodeBlock,
  pre: (props) => /* @__PURE__ */ React.createElement("div", __spreadValues({
    className: "code"
  }, props)),
  a: (props) => /* @__PURE__ */ React.createElement(ButtonLink, __spreadValues({}, props)),
  p: (props) => /* @__PURE__ */ React.createElement("p", __spreadValues({
    className: "paragraph"
  }, props)),
  strong: (props) => /* @__PURE__ */ React.createElement("strong", __spreadValues({
    style: { fontWeight: "bold" }
  }, props)),
  b: (props) => /* @__PURE__ */ React.createElement("strong", __spreadValues({
    style: { fontWeight: "bold" }
  }, props)),
  h2: (props) => /* @__PURE__ */ React.createElement("h2", __spreadValues({
    className: "subtitle"
  }, props)),
  img: (props) => /* @__PURE__ */ React.createElement("img", __spreadValues({
    className: "image"
  }, props)),
  blockquote: (props) => /* @__PURE__ */ React.createElement("blockquote", __spreadValues({
    className: "blockquote"
  }, props))
};

// route-module:C:\Users\cvr\projects\me\app\routes\blog\index.tsx
var blog_exports2 = {};
__export(blog_exports2, {
  default: () => Screen3,
  links: () => links5,
  loader: () => loader4,
  meta: () => meta4
});
var import_remix8 = __toModule(require("remix"));

// app/styles/blog-index.css
var blog_index_default = "/build/_assets/blog-index-IM5OESC2.css";

// route-module:C:\Users\cvr\projects\me\app\routes\blog\index.tsx
var meta4 = () => ({
  title: "Blog | Cristian"
});
function links5() {
  return [
    {
      rel: "stylesheet",
      href: blog_index_default
    }
  ];
}
var loader4 = async () => {
  let posts = await posts_exports.query();
  return {
    posts
  };
};
function Screen3() {
  const data = (0, import_remix8.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", {
    className: "blog"
  }, /* @__PURE__ */ React.createElement("h1", null, "Blog"), /* @__PURE__ */ React.createElement(VerticalSpacer, null), /* @__PURE__ */ React.createElement("ul", null, data.posts.map((post) => /* @__PURE__ */ React.createElement("li", {
    key: post.slug
  }, /* @__PURE__ */ React.createElement(import_remix8.Link, {
    to: post.slug
  }, post.title)))));
}

// <stdin>
var import_assets = __toModule(require("./assets.json"));
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/blog": {
    id: "routes/blog",
    parentId: "root",
    path: "blog",
    index: void 0,
    caseSensitive: void 0,
    module: blog_exports
  },
  "routes/blog/$slug": {
    id: "routes/blog/$slug",
    parentId: "routes/blog",
    path: ":slug",
    index: void 0,
    caseSensitive: void 0,
    module: slug_exports
  },
  "routes/blog/index": {
    id: "routes/blog/index",
    parentId: "routes/blog",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: blog_exports2
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
//# sourceMappingURL=/build/index.js.map
