import type { AnimationStep } from "./buildMoveTimeline";

export async function playTimeline(
  steps: AnimationStep[],
  runStep: (step: AnimationStep) => void,
  shouldCancel: () => boolean = () => false
) {
  const start = performance.now();

  for (const step of steps) {
    if (shouldCancel()) {
      return;
    }

    const waitFor = step.at - (performance.now() - start);
    if (waitFor > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, waitFor));
    }

    if (shouldCancel()) {
      return;
    }

    runStep(step);
  }
}
