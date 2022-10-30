import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import ImageCard from "../components/Surfaces/ImageCard";
import { transitions } from "../styles/motion-definitions";
import type { Post } from "../types/post";

//#region Fetch Functions

const fetchPosts = async () => {
  const res = await fetch("/api/Allposts");
  const data = (await res.json()) as { AllPostsOfAllUsers: Post[] };
  return data.AllPostsOfAllUsers;
};

//#endregion

//#region Variants

const container = {
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const item = {
  hidden: { scale: 0.9, y: -16, opacity: 0 },
  show: { scale: 1, y: 0, opacity: 1 },
};

//#endregion

export default function Feed() {
  //#region Hooks
  const { data: posts, isLoading: arePostsLoading } = useQuery(
    ["feed_posts"],
    fetchPosts
  );

  console.log(posts);

  //#endregion

  return (
    <main>
      {posts ? (
        <motion.ol
          variants={container}
          initial="hidden"
          animate="show"
          transition={transitions.springStiff}
          className={
            "grid list-none grid-cols-fill-10 justify-items-center gap-2 py-4 px-2 sm:grid-cols-fill-20 sm:px-4 md:gap-4 lg:grid-cols-fill-30 lg:px-8 2xl:grid-cols-fill-40"
          }
        >
          <AnimatePresence mode={"popLayout"}>
            {posts.map((data) => (
              <motion.li
                key={data.id}
                variants={item}
                exit={{ opacity: 0 }}
                transition={transitions.spring}
                className={"h-full w-full"}
              >
                <ImageCard
                  src={data.imageURL}
                  prompt={data.prompt}
                  authorName={data.author.name}
                  authorAvatar={data.author.avatar}
                  likes={data.likes.length}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ol>
      ) : (
        <div className={"flex h-full w-full items-center justify-center"}>
          {arePostsLoading ? <p>Loading...</p> : <p>Nothing to display</p>}
        </div>
      )}
    </main>
  );
}
