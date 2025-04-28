import { createRoute } from "./frourio.server";

export const { GET } = createRoute({
  get: async () => {
    return { status: 200, body: { value: "ok", id: "1" } };
  },
});
