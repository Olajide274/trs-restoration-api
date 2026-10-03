export const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  NEW: ['INSPECTION', 'CANCELLED'],
  INSPECTION: ['ESTIMATING', 'CANCELLED'],
  ESTIMATING: ['PROPOSAL_SENT', 'CANCELLED'],
  PROPOSAL_SENT: ['APPROVED', 'CANCELLED'],
  APPROVED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

export function isValidTransition(currentStatus: string, nextStatus: string): boolean {
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed) return false;
  return allowed.includes(nextStatus);
}