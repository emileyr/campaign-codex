import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { DefaultHead, DefaultLayout } from "~/layouts/default";
import { useMemo, useState } from "react";
import { z } from "zod";

const { window } = global;

const SortDirection = z.literal("asc").or(z.literal("desc")).default("asc");
type SortDirection = z.infer<typeof SortDirection>;

const parseSortDirection = (data: string | null): SortDirection => {
  try {
    return SortDirection.parse(data);
  } catch (error) {
    return "asc";
  }
};

const PagesIndex: NextPage = () => {
  const urlSearchParams = useMemo(() => {
    return new URLSearchParams(window?.location?.search);
  }, []);

  const [sort, setSort] = useState<string | null>(urlSearchParams.get("sort"));
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    parseSortDirection(urlSearchParams.get("sort_direction"))
  );

  return (
    <>
      <DefaultHead />
      <DefaultLayout>
        <main className="container mx-auto grid grid-cols-[repeat(auto-fill,_minmax(25rem,_1fr))] gap-8 px-2 py-4">
          <section className="inline-block rounded bg-pink-500 bg-opacity-30 p-3 ">
            <h1 className="mb-4 inline-block border-b border-white border-opacity-20 pr-4 pb-1 text-2xl">
              Recently Updated
            </h1>
            <ul className="flex flex-col gap-2">
              <li className="text-sm">
                <Link href="/p?sort=">more...</Link>
              </li>
            </ul>
          </section>
          <section className="inline-block rounded bg-pink-500 bg-opacity-30 p-3">
            <h1 className="mb-4 inline-block border-b border-white border-opacity-20 pr-4 pb-1 text-2xl">
              Newly Created
            </h1>
            <ul className="flex flex-col gap-2">
              <li className="text-sm">
                <Link href="/p?sort=">more...</Link>
              </li>
            </ul>
          </section>
        </main>
      </DefaultLayout>
    </>
  );
};

export default PagesIndex;

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
