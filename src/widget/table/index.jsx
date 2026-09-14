import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Presentational table chrome — header tone, row rules, hover, scroll.
 * It renders no data of its own; a TanStack Table instance supplies the
 * rows, so sorting/paging stay the caller's concern.
 */
function Table({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'border-line rounded-card overflow-x-auto border',
        className
      )}
    >
      <table className="w-full border-collapse text-left" {...props}>
        {children}
      </table>
    </div>
  );
}

function TableHead({ children, className = '', ...props }) {
  return (
    <thead className={cn('bg-surface-sunken', className)} {...props}>
      {children}
    </thead>
  );
}

function TableBody({ children, className = '', ...props }) {
  return (
    <tbody className={cn('divide-line divide-y', className)} {...props}>
      {children}
    </tbody>
  );
}

function TableRow({ children, className = '', ...props }) {
  return (
    <tr
      className={cn('hover:bg-navy-soft/50 transition-colors', className)}
      {...props}
    >
      {children}
    </tr>
  );
}

function TableHeaderCell({ children, className = '', ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        'text-style-label text-ink-muted px-3 py-2.5 whitespace-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

function TableCell({ children, className = '', ...props }) {
  return (
    <td
      className={cn('text-style-4 text-ink px-3 py-2.5', className)}
      {...props}
    >
      {children}
    </td>
  );
}

const childrenAndClass = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Table.propTypes = childrenAndClass;
TableHead.propTypes = childrenAndClass;
TableBody.propTypes = childrenAndClass;
TableRow.propTypes = childrenAndClass;
TableHeaderCell.propTypes = childrenAndClass;
TableCell.propTypes = childrenAndClass;

export default Table;
export { TableHead, TableBody, TableRow, TableHeaderCell, TableCell };
