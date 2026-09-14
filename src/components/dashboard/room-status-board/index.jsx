import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../../../widget/card';
import RoomTile from '../../../widget/room-tile';
import { BLOCK, BLOCK_LABELS, BLOCK_VALUES } from '../../../constants/blocks';
import {
  ROOM_STATUS_LABELS,
  ROOM_STATUS_VALUES,
} from '../../../constants/roomStatus';
import { cn } from '../../../utils/cn';

const DONUT_RADIUS = 52;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

// At xl the two blocks sit side by side in an 11-column outer grid (8 + 3).
// `grid` is the tiles-per-row inside each block and must stay proportional to
// `span` — 16/8 and 6/3 are both 2 tiles per outer column — so a tile is the
// same width in both blocks. Change a `span` and its `grid` together.
const OUTER_COLUMNS = 'xl:grid-cols-11';
const BLOCK_COLUMNS = {
  [BLOCK.A]: { grid: 'xl:grid-cols-16', span: 'xl:col-span-8' },
  [BLOCK.B]: { grid: 'xl:grid-cols-6', span: 'xl:col-span-3' },
};

// Fallback for a block the design didn't account for.
const DEFAULT_BLOCK_COLUMNS = { grid: '', span: 'xl:col-span-11' };

const LEGEND_DOTS = {
  available: 'bg-available',
  occupied: 'bg-occupied',
  dirty: 'bg-dirty',
  blocked: 'bg-blocked',
  maintenance: 'bg-maintenance',
};

function groupByBlockAndFloor(rooms) {
  const blocks = new Map();
  rooms.forEach(room => {
    if (!blocks.has(room.block)) blocks.set(room.block, new Map());
    const floors = blocks.get(room.block);
    if (!floors.has(room.floor)) floors.set(room.floor, []);
    floors.get(room.floor).push(room);
  });
  return [...blocks.entries()].map(([block, floors]) => ({
    block,
    floors: [...floors.entries()].map(([floor, floorRooms]) => ({
      floor,
      rooms: floorRooms,
    })),
  }));
}

function RoomStatusBoard({ rooms, occupancyRate, className = '' }) {
  const [selectedId, setSelectedId] = useState(null);
  // Selecting a tile re-renders the board; memo keeps the regrouping off the
  // click path.
  const blocks = useMemo(() => groupByBlockAndFloor(rooms), [rooms]);
  const dashLength = (occupancyRate / 100) * DONUT_CIRCUMFERENCE;

  const legend = (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {ROOM_STATUS_VALUES.map(status => (
        <li
          key={status}
          className="text-style-7 text-ink-muted flex items-center gap-1.5"
        >
          <span
            className={cn('h-2.5 w-2.5 rounded-full', LEGEND_DOTS[status])}
          />
          {ROOM_STATUS_LABELS[status]}
        </li>
      ))}
    </ul>
  );

  const hint = (
    <p className="text-style-7 text-ink-subtle mt-2">
      Clicking a room tile opens its quick-edit menu
    </p>
  );

  return (
    <Card className={className}>
      <h2 className="text-style-2 text-ink">
        Room Status - Interactive Floor View
      </h2>
      <p className="text-style-7 text-ink-muted mt-0.5">
        {rooms.length} rooms across your property
      </p>

      <div className="mt-4 flex flex-col gap-5 xl:flex-row xl:items-start">
        <div
          className={cn(
            'grid min-w-0 flex-1 gap-4 xl:items-start',
            OUTER_COLUMNS
          )}
        >
          {blocks.map(({ block, floors }) => {
            const columns = BLOCK_COLUMNS[block] ?? DEFAULT_BLOCK_COLUMNS;

            return (
              <section key={block} className={columns.span}>
                <h3 className="text-style-6 text-ink-muted mb-1.5">
                  {BLOCK_LABELS[block]}
                </h3>
                <div className="space-y-3">
                  {floors.map(({ floor, rooms: floorRooms }) => (
                    <div
                      key={floor}
                      className="bg-surface-sunken border-line rounded-card flex items-center gap-2 border p-2"
                    >
                      <span className="text-style-7 text-ink-muted shrink-0 rotate-180 px-0.5 [writing-mode:vertical-rl]">
                        Floor {floor}
                      </span>
                      <div
                        className={cn(
                          'grid min-w-0 flex-1 grid-cols-6 content-start gap-1.5',
                          columns.grid
                        )}
                      >
                        {floorRooms.map(room => (
                          // The wrapper owns the cell: the tile's own `w-full`
                          // would otherwise win the cascade over a `className` override.
                          <div key={room.id}>
                            <RoomTile
                              roomNumber={room.number}
                              status={room.status}
                              solid
                              selected={selectedId === room.id}
                              onClick={() =>
                                setSelectedId(prev =>
                                  prev === room.id ? null : room.id
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* At xl the legend sits under Block B; narrower, the card
                    footer renders it instead. */}
                {block === BLOCK.B && (
                  <div className="mt-3 hidden xl:block">
                    {legend}
                    {hint}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-3 xl:mt-10 xl:w-44">
          {/* Decorative: the same figures are in the heading and the text
              below, so the chart is hidden from screen readers. */}
          <svg
            viewBox="0 0 120 120"
            aria-hidden="true"
            className="h-28 w-28 -rotate-90"
          >
            <circle
              cx="60"
              cy="60"
              r={DONUT_RADIUS}
              fill="none"
              strokeWidth="8"
              className="stroke-occupied-soft"
            />
            <circle
              cx="60"
              cy="60"
              r={DONUT_RADIUS}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dashLength} ${DONUT_CIRCUMFERENCE}`}
              className="stroke-occupied"
            />
            <g className="[transform-origin:center] rotate-90">
              <text
                x="60"
                y="56"
                textAnchor="middle"
                fontSize="22"
                fontWeight="700"
                className="fill-ink"
              >
                {rooms.length}
              </text>
              <text
                x="60"
                y="72"
                textAnchor="middle"
                fontSize="10"
                className="fill-ink-muted"
              >
                Rooms
              </text>
              <text
                x="60"
                y="84"
                textAnchor="middle"
                fontSize="10"
                className="fill-ink-muted"
              >
                Total
              </text>
            </g>
          </svg>
          <p className="text-style-5 text-ink-muted">
            {occupancyRate}% Occupied
          </p>
        </div>
      </div>

      <div className="border-line mt-4 border-t pt-3 xl:hidden">
        {legend}
        {hint}
      </div>
    </Card>
  );
}

RoomStatusBoard.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      number: PropTypes.string.isRequired,
      status: PropTypes.oneOf(ROOM_STATUS_VALUES).isRequired,
      block: PropTypes.oneOf(BLOCK_VALUES).isRequired,
      floor: PropTypes.number.isRequired,
    })
  ).isRequired,
  occupancyRate: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default RoomStatusBoard;
