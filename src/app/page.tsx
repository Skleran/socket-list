"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { api } from "../../convex/_generated/api";
import NewListDialog from "@/components/ui/new-list-dialog";
import { AnimatePresence, easeOut, motion } from "framer-motion";
import HomeListCardGrid from "@/components/ui/home-list-card-grid";
import HomeListCardList from "@/components/ui/home-list-card-list";
import HomeCollaboratedListCardList from "@/components/ui/home-collaborated-list-card-list";
import HomeCollaboratedListCardGrid from "@/components/ui/home-collaborated-list-card-grid";
import { useLayoutContext } from "@/components/ui/layout-context";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export type ListType = "DEFAULT" | "CHECK" | "SHOPPING";
export type Visibility = "private" | "public-read" | "public-edit";

export default function Lists() {
  const lists = useQuery(api.lists.get);
  const collabLists = useQuery(api.collaborators.getCollaboratedLists);
  const { layoutMode } = useLayoutContext();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousLayoutMode, setPreviousLayoutMode] = useState(layoutMode);
  const t = useTranslations();

  useEffect(() => {
    if (previousLayoutMode !== layoutMode) {
      setIsTransitioning(true);
      setPreviousLayoutMode(layoutMode);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);

      return;
    }
  }, [layoutMode, previousLayoutMode]);

  const containerVariants = {
    hidden: {
      // opacity: 0
    },
    visible: {
      // opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: isTransitioning ? 0.05 : 0.05,
        duration: 0.3,
        easing: easeOut,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(7px)",
      transform: "translateY(15%)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transform: "translateY(0%)",
    },
    exit: {
      opacity: 0,
      filter: "blur(5px)",
      transform: "translateY(10%)",
    },
  };

  const containerKey = `${layoutMode}-${lists?.length || 0}`;
  const collabContainerKey = `${layoutMode}-collab-${collabLists?.length || 0}`;

  return (
    <div className="w-full will-change-auto">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={containerKey}
          className={`grid grid-rows-auto sm:gap-4 mb-6 ${
            layoutMode === "grid"
              ? "grid-cols-2 gap-3 sm:grid-cols-3"
              : "grid-cols-1 gap-4 sm:grid-cols-2"
          }`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {lists?.map(
            (
              { _id, title, type }
              // , index
            ) => (
              <motion.div
                key={`${_id}-${layoutMode}`}
                variants={cardVariants}
                layout
                style={{ zIndex: 1 }} //??
              >
                {layoutMode === "grid" ? (
                  <HomeListCardGrid listId={_id} title={title} type={type} />
                ) : (
                  <HomeListCardList listId={_id} title={title} type={type} />
                )}
              </motion.div>
            )
          )}

          <motion.div
            variants={cardVariants}
            key={"new-list-dialog"}
            layout
            className={`${!lists ? "invisible" : "visible"}`}
          >
            <NewListDialog />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {!collabLists ? (
        <p className="animate-spin w-fit">|</p>
      ) : collabLists?.length === 0 ? (
        <></>
      ) : (
        <>
          <motion.div
            initial={{
              opacity: 0,
              filter: "blur(7px)",
              transform: "translateY(15%)",
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              transform: "translateY(0%)",
            }}
            exit={{
              opacity: 0,
              filter: "blur(7px)",
              transform: "translateY(15%)",
            }}
            // transition={{ duration: 0.4 }}
            className="border-b-1 w-full mb-4"
            // variants={cardVariants}
            layout
          />
          <motion.h4
            initial={{
              opacity: 0,
              filter: "blur(7px)",
              transform: "translateY(15%)",
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              transform: "translateY(0%)",
            }}
            exit={{
              opacity: 0,
              filter: "blur(7px)",
              transform: "translateY(15%)",
            }}
            // transition={{ duration: 0.4 }}
            key={"wqe"}
            className="text-xl font-semibold tracking-tight mb-3"
            // variants={cardVariants}
            layout
          >
            {t("HomePage.collab_lists")}
          </motion.h4>

          <AnimatePresence mode="wait">
            <motion.div
              key={collabContainerKey}
              className={`grid grid-rows-auto sm:gap-4 mb-6 ${
                layoutMode === "grid"
                  ? "grid-cols-2 gap-3 sm:grid-cols-3"
                  : "grid-cols-1 gap-4 sm:grid-cols-2"
              }`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {collabLists?.map(
                (
                  { _id, title, type }
                  // , index
                ) => (
                  <motion.div
                    key={`${_id}-${layoutMode}`}
                    variants={cardVariants}
                    layout
                    style={{ zIndex: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {layoutMode === "grid" ? (
                      <HomeCollaboratedListCardGrid
                        listId={_id}
                        title={title}
                        type={type}
                      />
                    ) : (
                      <HomeCollaboratedListCardList
                        listId={_id}
                        title={title}
                        type={type}
                      />
                    )}
                  </motion.div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
