type styles = {
  post: string,
  date: string,
  title: string,
  paragraph: string,
  subtitle: string,
  code: string,
  [@as "post-nav"]
  postNav: string,
  [@as "post-nav-item"]
  postNavItem: string,
  [@as "post-nav-item-date"]
  postNavItemDate: string,
  [@as "post-nav-item-title"]
  postNavItemTitle: string,
  newer: string,
};
[@module "./post.module.css"] external styles: styles = "default";

type props = {
  post: PostsApi.post,
  newerPost: Js.Nullable.t(PostsApi.post),
  olderPost: Js.Nullable.t(PostsApi.post),
};

module MdxComponents = {
  module Pre = {
    type props;
    let make = (props: props) =>
      React.cloneElement(<div className={styles.code} />, props);
  };

  module Link = {
    type props;
    let make = (props: props) => React.cloneElement(<ButtonLink />, props);
  };

  module Paragraph = {
    type props;
    let make = (props: props) =>
      React.cloneElement(<p className={styles.paragraph} />, props);
  };

  module Bold = {
    type props;
    let make = (props: props) =>
      React.cloneElement(
        <strong style={ReactDOM.Style.make(~fontWeight="bold", ())} />,
        props,
      );
  };

  module Subtitle = {
    type props;
    let make = (props: props) =>
      React.cloneElement(<h2 className={styles.subtitle} />, props);
  };

  let map = {
    "code": CodeBlock.make,
    "pre": Pre.make,
    "a": Link.make,
    "p": Paragraph.make,
    "strong": Bold.make,
    "b": Bold.make,
    "h2": Subtitle.make,
  };
};

module PostNavItem = {
  [@react.component]
  let make = (~post: PostsApi.post, ~newer=false) => {
    let slug = post.slug;
    <div className={styles.postNavItem}>
      <div className=Cn.(styles.postNavItemDate + styles.newer->on(newer))>
        {newer ? {j|Newer →|j} : {j|← Older|j}}->React.string
      </div>
      <Next.Link _as={j|/blog/$(slug)|j} href="/blog/[slug]">
        <a className={styles.postNavItemTitle}> post.title->React.string </a>
      </Next.Link>
    </div>;
  };
};

let default = ({post, newerPost, olderPost}: props) => {
  let content =
    post.content
    ->Mdx.hydrateWithOptions(Mdx.makeOptions(~components=MdxComponents.map));
  <BlogLayout>
    <Next.Head>
      <title> {(post.title ++ " | Cristian")->React.string} </title>
    </Next.Head>
    <div className={styles.date}>
      {post.date->Js.Date.fromString->Date.format("MMMM d, y")->React.string}
    </div>
    <h1 className={styles.title}> post.title->React.string </h1>
    <VerticalSpacer size=`lg />
    content
    <VerticalSpacer size=`lg />
    <nav className={styles.postNav}>
      {switch (olderPost->Js.Nullable.toOption) {
       | Some(post) => <PostNavItem post />
       | None => <div />
       }}
      {switch (newerPost->Js.Nullable.toOption) {
       | Some(post) => <PostNavItem post newer=true />
       | None => <div />
       }}
    </nav>
  </BlogLayout>;
};

type params = {slug: string};

type context = {params};

let getStaticProps = ({params}: context) => {
  let posts = PostsApi.getAllPosts();
  let postIndex =
    posts->Belt.Array.getIndexBy(post => post.slug === params.slug);

  let makeMdxPost = (post, content) => PostsApi.{...post, content};

  let post =
    postIndex->Belt.Option.flatMap(index => posts->Belt.Array.get(index));

  let olderPost =
    postIndex->Belt.Option.flatMap(index => {
      let newIndex = index + 1;
      let isWithinPosts = newIndex <= posts->Belt.Array.length - 1;
      isWithinPosts ? posts->Belt.Array.get(newIndex) : None;
    });

  let newerPost =
    postIndex->Belt.Option.flatMap(index => {
      let newIndex = index - 1;
      let isWithinPosts = newIndex >= 0;
      isWithinPosts ? posts->Belt.Array.get(newIndex) : None;
    });

  let post = Belt.Option.getUnsafe(post);
  post.content
  ->Mdx.renderToStringWithOptions(
      Mdx.makeOptions(~components=MdxComponents.map),
    )
  ->Promise.map(content =>
      {
        "props": {
          "olderPost":
            olderPost->Belt.Option.getWithDefault(Obj.magic(Js.Null.empty)),
          "newerPost":
            newerPost->Belt.Option.getWithDefault(Obj.magic(Js.Null.empty)),
          "post": makeMdxPost(post, content),
        },
      }
    );
};

let getStaticPaths = () => {
  let posts = PostsApi.getAllPosts();

  {
    "paths": posts->Belt.Array.map(post => {
                                             "params": {
                                               "slug": post.slug,
                                             },
                                           }),
    "fallback": false,
  };
};
