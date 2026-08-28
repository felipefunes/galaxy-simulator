/**
 * Accumulated simulation time, separate from the scene's real wall-clock
 * time. A plain mutable object rather than React/zustand state — it's
 * written and read every frame, and funneling that through state would
 * re-render the whole tree 60 times a second.
 *
 * Using an accumulator (rather than just multiplying the real elapsed time
 * by the current speed each frame) matters: if the user changes timeSpeed
 * mid-animation, multiplying the *whole* elapsed real time by the new speed
 * would retroactively rescale the past too, snapping every star to a new
 * position. Accumulating delta·speed each frame only changes the *rate* of
 * future motion, so there's no jump.
 */
export const simulationClock = { time: 0 }
