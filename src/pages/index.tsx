import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { DefaultHead, DefaultLayout } from "~/layouts/default";
import { Modal } from "~/components/modals";
import { useState } from "react";
import { NewPost } from "~/components/forms";
import clsx from "clsx";

const Home: NextPage = () => {
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
  });
  const updatedPostsQuery = api.posts.index.useQuery({
    limit: 5,
    sort: "updatedAt",
  });
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <DefaultHead />
      <DefaultLayout>
        <section className="container mx-auto grid grid-cols-1 gap-8 px-4 py-4 md:grid-cols-[repeat(auto-fit,_minmax(25rem,_1fr))]">
          <article className="inline-block rounded bg-purple-900 p-3">
            <ul className="flex flex-col gap-2">
              {userPostsQuery.status === "loading" && <li>Loading...</li>}
              {userPostsQuery.status === "error" && (
                <li>{userPostsQuery.error.message}</li>
              )}
              {userPostsQuery.status === "success" && (
                <>
                  {userPostsQuery.data.map(({ id: postId, title }) => (
                    <li key={postId}>{title}</li>
                  ))}
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
              <li>
                <button
                  className="mx-auto block w-60 rounded-md bg-purple-800 p-2 hover:bg-purple-600 hover:drop-shadow"
                  onClick={() => setRenderNewPost(true)}
                >
                  new
                </button>
              </li>
            </ul>
          </article>
          <article className="inline-block rounded bg-purple-900 p-3">
            <h1 className="mb-4 inline-block border-b border-purple-800 pr-4 pb-1 text-2xl">
              Recently Updated
            </h1>
            <ul className="flex flex-col gap-2">
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

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {JSON.stringify(sessionData)}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
