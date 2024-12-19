import z, { string } from "zod";
import { FastifyTypedInstance } from "../types/fastifyTypedInstance";
import { randomUUID } from "node:crypto";

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [];

export async function userExample(app: FastifyTypedInstance) {
  app.get(
    "/users",
    {
      schema: {
        tags: ["users"],
        description: "List users",
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            })
          ),
        },
      },
    },
    () => {
      return users;
    }
  );
  app.post(
    "/users",
    {
      schema: {
        tags: ["users"],
        description: "Create a user",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.null().describe("User created"),
        },
      },
    },
    async (req, res) => {
      const { name, email } = req.body;

      users.push({
        id: randomUUID(),
        name,
        email,
      });
      return res.status(201).send();
    }
  );
}
