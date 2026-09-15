# Raintech Hotel — Room Booking

A hotel PMS front-end. The booking screen lives at **`/booking`**: enter the
guest details, pick a check-in and check-out date, pick a room, and see the
nights and total price, with validation on the guest, the dates and the room.

It captures the same guest fields as the check-in window — name, ID proof and
adults/kids — so a reservation carries the identity the front desk needs on
arrival.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

Then open [http://localhost:5173/booking](http://localhost:5173/booking). The
page is also reachable from the dashboard's **Reservations** quick action.

```bash
npm test         # unit tests (Vitest)
npm run build    # production build
npm run lint     # ESLint
```

No backend, database or API keys — all data is mocked in
`src/services/mock-data/`.

## Stack

|           |                                                                                    |
| --------- | ---------------------------------------------------------------------------------- |
| Framework | React 19 + Vite 8 (plain JavaScript, not TypeScript)                               |
| Styling   | Tailwind CSS v4, via `@tailwindcss/vite` — design tokens in `src/styles/index.css` |
| Data      | TanStack Query over mock services                                                  |
| Routing   | React Router 7                                                                     |
| Tests     | Vitest                                                                             |

React was chosen because the surrounding PMS is already a React SPA; the booking
page reuses its widget library and design tokens rather than introducing a
second visual language.

## How it's organised

Logic is kept out of the UI so it can be tested directly:

```
src/helpers/booking.js        all date/night/price/availability logic (pure)
src/helpers/booking.test.js   28 unit tests over that logic
src/constants/booking.js      error codes + their user-facing messages
src/services/mock-data/       the 5 sample rooms + 2 seeded bookings
src/components/booking/       guest details, date selector, room list, summary
src/pages/booking/Booking.jsx composes the above, owns the form state
```

`quoteStay()` is the single entry point the page calls. It returns either the
first blocking error (as a code plus a display message) or the priced stay —
never both, so a stale total can't sit next to an error message.

### Date handling

Night counts are computed on **UTC-midnight timestamps**, not raw `Date`
subtraction. Two reasons, both of which are silent bugs otherwise:

- A date input yields a bare calendar date. Parsing it as UTC but comparing it
  against a local-time "today" makes today look like yesterday west of
  Greenwich, so a valid same-day check-in gets rejected as "in the past".
- Across a daylight-saving boundary a day is 23 or 25 hours, so dividing a
  millisecond span by 86,400,000 gives a fractional night count.

Both cases are covered by tests.

### Validation

| Rule                         | Message                                                 |
| ---------------------------- | ------------------------------------------------------- |
| No check-in date             | Select a check-in date.                                 |
| No check-out date            | Select a check-out date.                                |
| Check-in before today        | Check-in cannot be in the past.                         |
| Check-out on/before check-in | Check-out must be after check-in.                       |
| No room picked               | Select a room to see the total.                         |
| Room booked for those dates  | This room is already booked for the selected dates.     |
| Party larger than the room   | This room does not sleep the number of guests selected. |

Date errors attach to the field that caused them; the rest surface in the
summary panel. Nothing fails silently, and no total is ever shown alongside an
error.

Guest validation is deliberately kept out of `quoteStay()` and checked
separately by `validateGuest()`. An incomplete guest must not suppress the
price — you can see what the stay costs while you're still filling the form in
— but it does block **Confirm Reservation**. Guest errors stay hidden until the
first confirm attempt, so the form doesn't scold you about fields you haven't
reached yet.

Adults and kids both count toward room capacity, since a kid still occupies a
bed; at least one adult is required to hold the reservation.

Overlap is treated as half-open `[checkIn, checkOut)` — a stay ending the
morning another begins does not clash, since the room turns over that day.

## Bonus items

All three are implemented:

- **Booked rooms are blocked** — two bookings are seeded in
  `src/services/mock-data/bookingRooms.js`, relative to today so they never
  fall into the past. Clashing rooms stay visible but disabled with the reason
  shown, rather than disappearing.
- **Unit tests for the night/price calculation** — `npm test`, 28 tests
  covering same-day, reversed and missing ranges, month/leap-day/DST
  boundaries, overlap edges and each validation rule.
- **Filter by max guests** — rooms too small for the party are removed from the
  list.

## What I'd improve with more time

- **Persist the booking.** Confirming a stay only acknowledges that the
  reservation is valid — nothing is saved, and the ID proof is never uploaded
  (only the file name is kept). A real flow would POST the reservation and the
  document, then invalidate the availability query.
- **Component tests.** The pure logic is well covered, but there are no tests
  asserting that the page wires it up correctly — that a disabled room can't be
  selected, that the total clears when dates change. That needs
  `@testing-library/react` and a jsdom environment.
- **Reconcile the two room datasets.** `mock-data/rooms.js` (housekeeping floor
  view: numeric rooms, status per room) and `mock-data/bookingRooms.js` (this
  page's rate card) describe the same hotel in different shapes, because the
  exercise's sample data doesn't match the existing PMS data. Against a real API
  these would be one resource.
- **A date-range picker.** Two native date inputs are functional but let you
  pick a nonsensical range before the error explains why; a linked two-month
  calendar showing availability would prevent the mistake instead of reporting
  it.
- **Currency/locale.** `formatCurrency` is hard-coded to INR and `en-IN`.
