import type { AnimationStep } from "./buildMoveTimeline";

export async function playTimeline(
  steps: AnimationStep[],
  runStep: (step: AnimationStep) => void
) {
  const start = performance.now();

  for (const step of steps) {
    const waitFor = step.at - (performance.now() - start);
    if (waitFor > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, waitFor));
    }

    runStep(step);
  }
}
