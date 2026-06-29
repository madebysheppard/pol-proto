/**
 * Progress bar utility.
 *
 * Maps each screen that shows a progress-track__indicator to its
 * percentage through the flow. Two flows are defined:
 *
 *  - SEND_FLOW  – the linear "send a parcel" journey (12 steps)
 *  - DROP_OFF_FLOW – the alternative drop-off journey (1 step shown)
 *
 * Returns null for screens that have no progress indicator (the router
 * uses null to skip setting a width).
 */

const SEND_FLOW = [
  "send-addressfrom",
  "send-addressto",
  "size",
  "heavy",
  "choose-postage",
  "compensation",
  "recipient-details",
  "delivery-address",
  "confirm-delivery-details",
  "return-details",
  "return-address",
  "confirm-return-details",
];

/** Screens that belong to a separate mini-flow with a fixed percentage. */
const FIXED = {
  "drop-off": 33,
};

/**
 * Returns the progress percentage (0–100) for a given screen ID, or
 * null if that screen does not have a progress indicator.
 */
export function getProgressPct(screenId) {
  if (Object.prototype.hasOwnProperty.call(FIXED, screenId)) {
    return FIXED[screenId];
  }
  const index = SEND_FLOW.indexOf(screenId);
  if (index === -1) return null;
  return Math.round(((index + 1) / SEND_FLOW.length) * 100);
}
