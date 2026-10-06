// Exactly and strictly the designated Work page slots
export const VALID_WORK_SLOT_IDS = new Set<string>([
  // 28 Photos
  'work-001', 'work-002', 'work-003', 'work-004', 'work-005', 'work-006', 'work-007',
  'work-008', 'work-009', 'work-010', 'work-011', 'work-012', 'work-013', 'work-014',
  'work-015', 'work-016', 'work-017', 'work-018', 'work-019', 'work-020', 'work-021',
  'work-022', 'work-023', 'work-024', 'work-025', 'work-026', 'work-027', 'work-028',
  // 8 Videos
  'work-video-01', 'work-video-02', 'work-video-03', 'work-video-04',
  'work-video-05', 'work-video-06', 'work-video-07', 'work-video-08',
]);

export function isValidWorkSlot(slotId: string): boolean {
  if (!slotId || typeof slotId !== 'string') return false;
  return VALID_WORK_SLOT_IDS.has(slotId) || slotId.startsWith('work-new-');
}
