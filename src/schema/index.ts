import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  image: z.string().nullable(),
  twitterId: z.string().nullable(),
});

export const lectureSchema = z.object({
  id: z.string(),
  name: z.string(),
  day: z.enum([
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日",
    "日曜日",
  ]),
  periodNumber: z.number().int().positive(),
});

export const timetableSchema = z.record(
  z.string().regex(/^\d+$/),
  z.array(lectureSchema),
);
