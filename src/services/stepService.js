/**
 * Step_Service stub — returns hardcoded steps after a simulated delay.
 * Replace this file with a real API implementation when the backend is ready.
 * No UI component changes are required when swapping this out.
 *
 * @param {string} _prompt - The user's prompt (ignored by the stub)
 * @returns {Promise<import('../types.js').Step[]>}
 */
export async function getSteps(_prompt) {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      description: 'Gather all required ingredients and equipment before you begin.',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      done: false,
    },
    {
      description: 'Follow the preparation steps carefully, working through each one in order.',
      done: false,
    },
    {
      description: 'Review your work and confirm everything looks correct before finishing.',
      done: false,
    },
  ]
}
