[@react.component]
let make = (~children: option(React.element)=?) => {
  <Next.Head>
    {switch (children) {
     | Some(children) => children
     | None => React.null
     }}
    <script src="/check-theme-preference.js" async=true />
    <style>
      {|
        @font-face {
            font-family: "Megrim";
            font-style: normal;
            font-weight: 400;
            src: local("Megrim"),
              url(https://fonts.gstatic.com/s/megrim/v11/46kulbz5WjvLqJZVam_hVUdI1w.woff2)
                format("woff2");
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
              U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,
              U+FEFF, U+FFFD;
        }
      |}
      ->React.string
    </style>
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type_="image/png"
      sizes="32x32"
      href="/favicon-32x32.png"
    />
    <link
      rel="icon"
      type_="image/png"
      sizes="16x16"
      href="/favicon-16x16.png"
    />
    <link rel="manifest" href="/manifest.json" />
    <meta
      name="Description"
      content="A developer who's interested in working with you. Let's find out more!"
    />
  </Next.Head>;
};
