import { useState } from "react";
import { api } from "~/utils/api";
import { formatSlug } from "~/utils/slugs";
import { Modal } from "./modals";

type NewPostProps = {
  setRender?: (render: boolean) => void;
  onSettled?: () => void;
};

export const NewPost = ({ setRender, onSettled = () => {} }: NewPostProps) => {
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const { mutate: createPost } = api.posts.new.useMutation({ onSettled });

  const updateTitle = (newTitle: string) => {
    setTitle(newTitle);
    if (slug === formatSlug(title)) {
      setSlug(formatSlug(newTitle));
    }
  };

  const updateSlug = (newSlug: string) => setSlug(formatSlug(newSlug));

  const handleCreate = async () => {
    if (title.length < 1) {
      return setTitleError("Title must have at least one character");
    }
    if (slug.length < 1) {
      return setSlugError("Slug must have at least one character");
    }

    createPost({ title, slug });
    if (setRender) {
      setRender(false);
    }
  };

  return (
    <form
      className="w-72 rounded bg-violet-900 p-4 sm:w-96"
      onSubmit={() => {}}
    >
      <h1 className="text-lg">New Page</h1>
      <input
        id="name-input"
        type="text"
        title="Title"
        placeholder="e.g. History of the World"
        className="my-2 block w-full rounded bg-violet-800 px-4 py-2 placeholder:text-stone-400"
        value={title}
        onChange={({ target }) => updateTitle(target.value)}
      />
      <div title="Slug" className="my-2 flex rounded bg-violet-800">
        <span className="ml-4 mr-1 py-2 text-stone-300">p/</span>
        <input
          id="slug-input"
          type="text"
          title="Slug"
          className="min-w-0 flex-1 rounded bg-violet-800 py-2 focus:pl-4"
          value={slug}
          onChange={({ target }) => updateSlug(target.value)}
        />
        {/* <span className="h-full self-center mx-4">{slugIndicator}</span> */}
      </div>
      <div className="mt-4 flex">
        <button
          type="button"
          className="ml-auto w-32 self-end rounded-full p-2 hover:bg-violet-800 hover:drop-shadow"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </form>
  );
};
