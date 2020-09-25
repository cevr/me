type styles = {contact: string};
[@module "./contacts.module.css"] external styles: styles = "default";

let email = "hello@cvr.im";

let default = () =>
  <Layout>
    <Head> <title> "Contact | Cristian"->React.string </title> </Head>
    <Nav />
    <main className={styles.contact}>
      <h1> "Don't be shy"->React.string </h1>
      <blockquote>
        <ExternalLink
          className="email" href={j|mailto:$email?subject=Hi Cristian!|j}>
          "email"->React.string
        </ExternalLink>
      </blockquote>
    </main>
    <Footer />
  </Layout>;
