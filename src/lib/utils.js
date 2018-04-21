export function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/* Credit to Jordan Eldredge on these:
 * https://github.com/captbaritone/webamp/blob/master/js/utils.js
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const toPercent = (min, max, value) => (value - min) / (max - min);

export const percentToRange = (percent, min, max) =>
  min + Math.round(percent * (max - min));

export const rebound = ([oldMin, oldMax], [newMin, newMax], oldValue) =>
  percentToRange(toPercent(oldMin, oldMax, oldValue), newMin, newMax);
