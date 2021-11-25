import { MetaFunction, LoaderFunction, useLoaderData, Link } from 'remix';
import { VerticalSpacer } from '~/components';
import { postsApi } from '~/lib';
import { Post } from '~/lib/posts';

import blogIndexStyles from '../../styles/blog-index.css';

export let meta: MetaFunction = () => ({
  title: 'Blog | Cristian',
});

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: blogIndexStyles,
    },
  ];
}

export let loader: LoaderFunction = async () => {
  let posts = await postsApi.query();
  return {
    posts,
  };
};

export default function Screen() {
  const data = useLoaderData<{ posts: Post[] }>();
  return (
    <div className="blog">
      <h1>Blog</h1>
      <VerticalSpacer />
      <ul>
        {data.posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
