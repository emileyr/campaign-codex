import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { DefaultHead, DefaultLayout } from "~/layouts/default";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const getQuerySlug = (query: ParsedUrlQuery) => {
  const { postSlug } = query;
  if (!postSlug || postSlug.length < 1) return undefined;
  return postSlug;
};

const PostShowPage: NextPage = () => {
  const { query } = useRouter();

  return (
    <>
      <DefaultHead title="Page" />
      <DefaultLayout>
        <></>
      </DefaultLayout>
    </>
  );
};

export default PostShowPage;
