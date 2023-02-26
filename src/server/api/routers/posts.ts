import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const postsRouter = createTRPCRouter({
  findBySlug: protectedProcedure
    .input(
      z
        .string()
        .regex(/^[a-z\-]*$/)
        .nullish()
    )
    .query(({ input }) => {
      if (!input) throw new TRPCError({ code: "NOT_FOUND" });
      return prisma.post.findFirstOrThrow({ where: { slug: input } });
    }),
  index: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().default(20),
        page: z.number().int().default(1),
        filter: z.literal("userId").nullish(),
        sort: z
          .literal("insertedAt")
          .or(z.literal("updatedAt"))
          .default("insertedAt"),
        sortDirection: z.literal("asc").or(z.literal("desc")).default("asc"),
      })
    )
    .query(({ input, ctx }) => {
      const {
        filter,
        limit,
        page,
        sort = "updatedAt",
        sortDirection = "asc",
      } = input;
      let orderBy;
      switch (sort) {
        case "updatedAt": {
          orderBy = { updatedAt: sortDirection };
          break;
        }

        default:
        case "insertedAt": {
          orderBy = { insertedAt: sortDirection };
          break;
        }
      }

      return prisma.post.findMany({
        where: {
          userId: filter === "userId" ? ctx.session.user.id : undefined,
        },
        orderBy,
        take: limit,
        skip: page - 1,
      });
    }),
  new: protectedProcedure
    .input(z.object({ title: z.string().min(1), slug: z.string().min(1) }))
    .mutation(({ input, ctx }) => {
      const { session } = ctx;
      const { title, slug } = input;
      return prisma.post.create({
        data: { title, slug, userId: session.user.id },
      });
    }),
});
