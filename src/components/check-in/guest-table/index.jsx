import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  createCoreRowModel,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import Icon from '../../../widget/icon';
import { cn } from '../../../utils/cn';
import Pagination from '../../../widget/pagination';
import Table, {
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '../../../widget/table';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

const PAGE_SIZE = 10;

/* v9 takes features and row models as one `features` option; `_features` and
   `_rowModels` on the instance are read-only. Columns are declared only so the
   row model has something to build — the cells are rendered by hand below. */
const features = tableFeatures({
  rowPaginationFeature,
  coreRowModel: createCoreRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
});

const columns = [{ id: 'guest', accessorKey: 'id' }];

const pad = value => String(value).padStart(2, '0');

function GuestTable({ guests, onGuestAction, className = '' }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const table = useTable({
    features,
    columns,
    data: guests,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  const pageCount = table.getPageCount();
  const rows = table.getPaginatedRowModel().rows;

  return (
    /* min-w-0: as a grid item this div defaults to min-width:auto, which
       refuses to shrink below the 68rem table and pushes the whole page wide
       instead of letting the scroller below take over. */
    <div className={cn('min-w-0', className)}>
      {/* minWidth lands on the <table> (Table spreads ...props onto it), not
          the scroll container. Without it the table's w-full shrinks the ten
          columns to fit and the Action column clips instead of scrolling. */}
      <Table style={{ minWidth: '68rem' }}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Room No.</TableHeaderCell>
            <TableHeaderCell>Rent (₹)</TableHeaderCell>
            <TableHeaderCell>GST</TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>No:of Adults</TableHeaderCell>
            <TableHeaderCell>No:of Kids</TableHeaderCell>
            <TableHeaderCell>Senior Citizen</TableHeaderCell>
            <TableHeaderCell>Checkout Date</TableHeaderCell>
            <TableHeaderCell>ID Proof</TableHeaderCell>
            <TableHeaderCell className="text-right">Action</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ original: guest }) => (
            <TableRow key={guest.id}>
              <TableCell>{guest.roomNumber}</TableCell>
              <TableCell>{formatCurrency(guest.rent)}</TableCell>
              <TableCell>{formatCurrency(guest.gst)}</TableCell>
              <TableCell className="whitespace-nowrap">{guest.name}</TableCell>
              <TableCell>{pad(guest.adults)}</TableCell>
              <TableCell>{pad(guest.kids)}</TableCell>
              <TableCell>{pad(guest.seniorCitizen)}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(guest.checkoutDate)}
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-1.5">
                  <span className="block max-w-28 truncate">
                    {guest.idProof}
                  </span>
                  <Icon name="document" className="text-ink-subtle" />
                </span>
              </TableCell>
              <TableCell className="text-right">
                <button
                  type="button"
                  aria-label={`Actions for ${guest.name}`}
                  onClick={() => onGuestAction?.(guest)}
                  className="text-ink-muted rounded-field hover:bg-surface-muted hover:text-ink inline-flex h-8 w-8 items-center justify-center transition-colors"
                >
                  <Icon name="more" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pageCount > 1 && (
        <Pagination
          pageIndex={pagination.pageIndex}
          pageCount={pageCount}
          onPageChange={pageIndex =>
            setPagination(prev => ({ ...prev, pageIndex }))
          }
          className="mt-3"
        />
      )}
    </div>
  );
}

GuestTable.propTypes = {
  guests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      roomNumber: PropTypes.string.isRequired,
      rent: PropTypes.number.isRequired,
      gst: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      adults: PropTypes.number.isRequired,
      kids: PropTypes.number.isRequired,
      seniorCitizen: PropTypes.number.isRequired,
      checkoutDate: PropTypes.string.isRequired,
      idProof: PropTypes.string.isRequired,
    })
  ).isRequired,
  onGuestAction: PropTypes.func,
  className: PropTypes.string,
};

export default GuestTable;
