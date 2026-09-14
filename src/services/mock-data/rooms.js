import { BLOCK } from '../../constants/blocks';
import { ROOM_STATUS } from '../../constants/roomStatus';

const TYPES = ['single', 'double', 'deluxe', 'suite'];
const PRICES = { single: 1800, double: 2600, deluxe: 4200, suite: 7500 };

const STATUS_BY_CODE = {
  A: ROOM_STATUS.AVAILABLE,
  O: ROOM_STATUS.OCCUPIED,
  D: ROOM_STATUS.DIRTY,
  M: ROOM_STATUS.MAINTENANCE,
  B: ROOM_STATUS.BLOCKED,
};

// `statuses`: one STATUS_BY_CODE character per room, left to right across the
// floor. Room numbers are `numberPrefix` + position, so block A is the 100s and
// 200s, block B the 300s and 400s.
const FLOORS = [
  {
    block: BLOCK.A,
    floor: 1,
    numberPrefix: 1,
    statuses: 'AAAAAAAAAAAAAAAAAAOODDMMAAAOOAAA',
  },
  {
    block: BLOCK.A,
    floor: 2,
    numberPrefix: 2,
    statuses: 'AAAAMBAAAMBAABAAAAAAAABBOAAMAAAAABAAAAABBBBAAAAO',
  },
  {
    block: BLOCK.B,
    floor: 1,
    numberPrefix: 3,
    statuses: 'AAAAAAAOODDM',
  },
  {
    block: BLOCK.B,
    floor: 2,
    numberPrefix: 4,
    statuses: 'AAAAMBAAAAAA',
  },
];

// Stands in for the reservation data the API will carry on each room.
const DEPARTURES = {
  119: 'Departing — Check-Out Scheduled',
  120: 'Departing — Check-Out Scheduled',
  308: 'Departing — Late Check-Out',
};

const OVERDUE_CLEANING = ['121', '310'];

let id = 0;

const ROOMS = FLOORS.flatMap(({ block, floor, numberPrefix, statuses }) =>
  [...statuses].map((code, index) => {
    const type = TYPES[index % TYPES.length];
    const number = `${numberPrefix}${String(index + 1).padStart(2, '0')}`;
    id += 1;

    return {
      id,
      number,
      type,
      status: STATUS_BY_CODE[code],
      pricePerNight: PRICES[type],
      block,
      floor,
      departureNote: DEPARTURES[number] ?? null,
      cleaningOverdue: OVERDUE_CLEANING.includes(number),
    };
  })
);

// Dummy data until the API is ready.
export const getRooms = async () => ROOMS;
