export const MOCK_CONFIG = {
  quiz: true,
  enrollment: true
}

export function isMockEnabled(module) {
  return !!MOCK_CONFIG[module]
}
