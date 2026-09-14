/** Room states shown in the floor view legend. */
export const ROOM_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  DIRTY: 'dirty',
  MAINTENANCE: 'maintenance',
  BLOCKED: 'blocked',
};

export const ROOM_STATUS_VALUES = Object.values(ROOM_STATUS);

export const ROOM_STATUS_LABELS = {
  [ROOM_STATUS.AVAILABLE]: 'Available',
  [ROOM_STATUS.OCCUPIED]: 'Occupied',
  [ROOM_STATUS.DIRTY]: 'Dirty',
  [ROOM_STATUS.MAINTENANCE]: 'Maintenance',
  [ROOM_STATUS.BLOCKED]: 'Blocked',
};
