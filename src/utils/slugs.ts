import slugify from "slugify";

export const formatSlug = (input: string): string => {
  return slugify(input, { lower: true, trim: false, strict: true });
};
