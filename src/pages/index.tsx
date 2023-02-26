import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { DefaultHead, DefaultLayout } from "~/layouts/default";
import { Modal } from "~/components/modals";
import { useState } from "react";
import { NewPost } from "~/components/forms";
import { Post } from "@prisma/client";

const HomePage: NextPage = () => {
  const [renderNewPost, setRenderNewPost] = useState(false);
  const userPostsQuery = api.posts.index.useQuery({
    limit: 5,
    sort: "updatedAt",
    sortDirection: "desc",
    filter: "userId",
  });
  const insertedPostsQuery = api.posts.index.useQuery({
    limit: 5,
    sort: "insertedAt",
    sortDirection: "desc",
  });
  const updatedPostsQuery = api.posts.index.useQuery({
    limit: 5,
    sort: "updatedAt",
    sortDirection: "desc",
  });

  return (
    <>
      <DefaultHead />
      <DefaultLayout>
        <section className="container mx-auto grid grid-cols-1 gap-8 px-4 py-4 md:grid-cols-[repeat(auto-fit,_minmax(25rem,_1fr))]">
          <article className="inline-block rounded bg-purple-900 p-3">
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  className="mx-auto mb-1 block w-60 rounded-md bg-purple-800 p-2 hover:bg-purple-600 hover:drop-shadow"
                  onClick={() => setRenderNewPost(true)}
                >
                  New Page
                </button>
              </li>
              {userPostsQuery.status === "loading" && <li>Loading...</li>}
              {userPostsQuery.status === "error" && (
                <li>{userPostsQuery.error.message}</li>
              )}
              {userPostsQuery.status === "success" && (
                <>
                  {userPostsQuery.data.map((post) => {
                    return (
                      <li key={post.id}>
                        <PostLink post={post} />
                      </li>
                    );
                  })}
                </>
              )}
              <li className="text-sm">
                <Link
                  className="rounded px-1 hover:bg-purple-800 hover:drop-shadow"
                  href="/p?filter=userId&sort=updatedAt"
                >
                  more...
                </Link>
              </li>
            </ul>
          </article>
          <article className="inline-block rounded bg-purple-900 p-3">
            <h1 className="mb-4 inline-block border-b border-purple-800 pr-4 pb-1 text-2xl">
              Recently Updated
            </h1>
            <ul className="flex flex-col gap-2">
              {updatedPostsQuery.status === "loading" && <li>Loading...</li>}
              {updatedPostsQuery.status === "error" && (
                <li>{updatedPostsQuery.error.message}</li>
              )}
              {updatedPostsQuery.status === "success" && (
                <>
                  {updatedPostsQuery.data.map((post) => {
                    return (
                      <li key={post.id}>
                        <PostLink post={post} />
                      </li>
                    );
                  })}
                </>
              )}
              <li className="text-sm">
                <Link
                  className="rounded px-1 hover:bg-purple-800 hover:drop-shadow"
                  href="/p?sort=updatedAt"
                >
                  more...
                </Link>
              </li>
            </ul>
          </article>
          <article className="inline-block rounded bg-purple-900 p-3">
            <h1 className="mb-4 inline-block border-b border-purple-800 pr-4 pb-1 text-2xl">
              Newly Created
            </h1>
            <ul className="flex flex-col gap-2">
              {insertedPostsQuery.status === "loading" && <li>Loading...</li>}
              {insertedPostsQuery.status === "error" && (
                <li>{insertedPostsQuery.error.message}</li>
              )}
              {insertedPostsQuery.status === "success" && (
                <>
                  {insertedPostsQuery.data.map((post) => {
                    return (
                      <li key={post.id}>
                        <PostLink post={post} />
                      </li>
                    );
                  })}
                </>
              )}
              <li className="text-sm">
                <Link
                  className="rounded px-1 hover:bg-purple-800 hover:drop-shadow"
                  href="/p?sort=insertedAt"
                >
                  more...
                </Link>
              </li>
            </ul>
          </article>
        </section>
      </DefaultLayout>
      <Modal render={renderNewPost} setRender={setRenderNewPost}>
        <NewPost
          setRender={setRenderNewPost}
          onSettled={() => {
            userPostsQuery.refetch();
            updatedPostsQuery.refetch();
            insertedPostsQuery.refetch();
          }}
        />
      </Modal>
    </>
  );
};

export default HomePage;

const PostLink = ({ post }: { post: Post }) => {
  const { slug, title, subTitle } = post;
  return (
    <Link href={`/p/${slug}`}>
      <div className="rounded p-2 hover:bg-purple-800">
        <h2>{title}</h2>
        {subTitle.length > 0 && (
          <p className="text-sm italic text-stone-300">{subTitle}</p>
        )}
      </div>
    </Link>
  );
};
