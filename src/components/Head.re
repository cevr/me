[@react.component]
let make = (~children: option(React.element)=?) =>
  <Next.Head>
    {switch (children) {
     | Some(children) => children
     | None => React.null
     }}
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
    <meta name="theme-color" content="#121315" />
    <meta
      name="Description"
      content="A developer who's interested in working with you. Let's find out more!"
    />
  </Next.Head>;