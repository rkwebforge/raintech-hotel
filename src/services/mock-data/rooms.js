const ROOMS = [
  {
    id: 1,
    number: '101',
    type: 'single',
    status: 'available',
    pricePerNight: 1800,
    floor: 1,
  },
  {
    id: 2,
    number: '102',
    type: 'double',
    status: 'occupied',
    pricePerNight: 2600,
    floor: 1,
  },
  {
    id: 3,
    number: '201',
    type: 'deluxe',
    status: 'available',
    pricePerNight: 4200,
    floor: 2,
  },
  {
    id: 4,
    number: '202',
    type: 'deluxe',
    status: 'maintenance',
    pricePerNight: 4200,
    floor: 2,
  },
  {
    id: 5,
    number: '301',
    type: 'suite',
    status: 'occupied',
    pricePerNight: 7500,
    floor: 3,
  },
];

// Dummy data until the API is ready.
export const getRooms = async () => ROOMS;
