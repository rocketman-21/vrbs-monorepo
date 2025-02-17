"use client";

import { StaticModal } from "@cobuild/ui/molecules/StaticModal/StaticModal";
import { AnimatePresence, motion } from "framer-motion";
import { usePostCreation } from "./PostCreationProvider";

export const PostCreationModal = () => {
  const { actions: ActionsComponent, ...postCreation } = usePostCreation();
  const { steps, currentStep, width, values, isModalOpen, closeModal } = postCreation;

  return (
    <StaticModal
      width={width}
      height="auto"
      title="Post a Creation"
      isOpen={isModalOpen}
      closeModal={closeModal}
      showCloseButton
      confirmClose={values.url.length > 0}
      actions={ActionsComponent && <ActionsComponent {...postCreation} />}
    >
      <AnimatePresence initial={false} mode="wait">
        {Object.entries(steps).map(
          ([step, StepComponent]) =>
            step === currentStep && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2, ease: "linear" } }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                key={`step_${step}}`}
                className="flex grow flex-col"
              >
                {<StepComponent />}
              </motion.div>
            ),
        )}
      </AnimatePresence>
    </StaticModal>
  );
};
