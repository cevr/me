type styles = {blog: string};
[@module "./blog.module.css"] external styles: styles = "default";

type props = {posts: array(PostsApi.post)};

let default = ({posts}: props) => {
  <BlogLayout className={styles.blog}>
    <Next.Head> <title> "Blog | Cristian"->React.string </title> </Next.Head>
    <h1> "Blog"->React.string </h1>
    <VerticalSpacer />
    <ul>
      {posts
       ->Belt.Array.map(post => {
           let slug = post.slug;
           <li key=slug>
             <Next.Link _as={j|/blog/$(slug)|j} href="/blog/[slug]">
               <a> post.title->React.string </a>
             </Next.Link>
           </li>;
         })
       ->React.array}
    </ul>
  </BlogLayout>;
};

let tenMinutes = 1 * 60 * 10;

let getStaticProps = _context => {
  let props = {posts: PostsApi.getAllPosts()};
  {"props": props, "revalidate": tenMinutes};
};
