%raw
"import 'preflight.css'";
%raw
"import '../styles/global.css'";

type pageProps = {.};

module PageComponent = {
  type t = React.component(pageProps);
};

type props = {
  [@bs.as "Component"]
  component: PageComponent.t,
  pageProps,
};

let default = (props: props): React.element => {
  let {component, pageProps} = props;
  let router = Next.Router.useRouter();

  <Layout home={router.route === "/"}>
    <Nav />
    {React.createElement(component, pageProps)}
    <Footer />
  </Layout>;
};
