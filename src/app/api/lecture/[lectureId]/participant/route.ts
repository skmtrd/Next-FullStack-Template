import { prisma } from "@/lib/prisma";
import { createRoute } from "./frourio.server";

export const { GET } = createRoute({
  get: async (req) => {
    const lectureId: string = req.params.lectureId;

    try {
      const participants = await prisma.timeTable.findMany({
        where: {
          lectureId: lectureId,
        },
        select: {
          lectureId: true,
          user: {
            select: {
              name: true,
              id: true,
              image: true,
              twitterId: true,
            },
          },
        },
      });

      return { status: 200, body: participants };
    } catch {
      return { status: 500, body: { message: "internal server error" } };
    }
  },
});
