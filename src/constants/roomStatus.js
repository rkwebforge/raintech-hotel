export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  DIRTY: 'dirty',
  BLOCKED: 'blocked',
  MAINTENANCE: 'maintenance',
};

export const ROOM_STATUS_VALUES = Object.values(ROOM_STATUS);

export const ROOM_STATUS_LABELS = {
  [ROOM_STATUS.AVAILABLE]: 'Available',
  [ROOM_STATUS.OCCUPIED]: 'Occupied',
  [ROOM_STATUS.DIRTY]: 'Dirty',
  [ROOM_STATUS.BLOCKED]: 'Blocked',
  [ROOM_STATUS.MAINTENANCE]: 'Maintenance',
};
