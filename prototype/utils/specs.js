/**
 * Helpers for loading exported screen specs from /specs.
 * Specs are served from the project root when using the recommended local server.
 */

export async function loadSpec(filename) {
  const response = await fetch(`../specs/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to load spec: ${filename} (${response.status})`);
  }
  return response.json();
}
