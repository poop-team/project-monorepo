import { validateRequest } from "@daydream/common";
import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";

interface Request extends NextApiRequest {
  body: {
    userId: string;
    postId: string;
  };
}

export default async function unlike(req: Request, res: NextApiResponse) {
  // Validate if the user has a valid JWT token
  if (!(await validateRequest(req))) {
    return res.status(401).json({ error: "You are not logged in" });
  }

  const { userId, postId } = req.body;

  if (!postId) {
    return res.status(400).json("Give me post to like");
  }

  const postToUnlike = await prisma.post.findFirst({
    where: {
      id: String(postId),
    },
  });

  if (!postToUnlike) {
    return res.status(400).json("give me a valid postId");
  }

  await prisma.like.deleteMany({
    where: {
      postID: postId,
      userId: userId,
    },
  });

  res.json({ success: true });
}
