open Node;

let postsDirectory = Path.join([|Process.cwd(), "src", "posts"|]);

let getPostSlugs = () =>
  Fs.readdirSync(postsDirectory)
  ->Belt.Array.keep(slug => !slug->Js.String2.startsWith("."));

type post = {
  date: string,
  title: string,
  slug: string,
  content: string,
};

let getPostBySlug = slug => {
  let pathToPost = Path.join([|postsDirectory, slug|]);
  let files = Fs.readdirSync(pathToPost);
  let indexFile =
    files->Belt.Array.getBy(file =>
      file->Js.String2.substring(
        ~from=0,
        ~to_=file->Js.String2.lastIndexOf("."),
      )
      === "index"
    );

  indexFile->Belt.Option.map(file => {
    let fullPath = Path.join([|pathToPost, file|]);
    let fileContents = Fs.readFileSync(fullPath, `utf8);
    let {data, content} = Markdown.meta(fileContents);
    {...data, slug, content};
  });
};

let getAllPosts = () => {
  getPostSlugs()
  ->Belt.Array.map(getPostBySlug)
  ->Belt.Array.keepMap(x => x)
  ->Js.Array2.sortInPlaceWith((post1, post2) =>
      post1.date > post2.date ? (-1) : 1
    );
};
