/* A departing guest and the rooms on their folio. `charges` are the posted
   extras that sit on top of the room rate; `nights * rate` is the room total. */
const DEPARTING_GUEST = {
  id: 1,
  name: 'Mathew Hyden',
  primaryRoom: '101',
  rooms: [
    {
      id: 101,
      number: '101',
      stayFrom: '2026-04-02',
      stayTo: '2026-04-04',
      nights: 2,
      rate: 1200,
      charges: [
        {
          id: 1,
          label: 'Mini-bar (Water x2)',
          date: '2026-04-03',
          amount: 100,
        },
        { id: 2, label: 'Room Service', date: '2026-04-03', amount: 1200 },
        {
          id: 3,
          label: 'Restaurant Bill (Room 101)',
          date: '2026-04-03',
          amount: 850,
        },
      ],
    },
    {
      id: 103,
      number: '103',
      stayFrom: '2026-04-02',
      stayTo: '2026-04-04',
      nights: 2,
      rate: 1200,
      charges: [
        { id: 4, label: 'Mini-bar (Chips)', date: '2026-04-03', amount: 50 },
        {
          id: 5,
          label: 'Restaurant Bill (Room 103)',
          date: '2026-04-03',
          amount: 1200,
        },
      ],
    },
  ],
};

// Dummy data until the API is ready.
export const getDepartingGuest = async () => DEPARTING_GUEST;
