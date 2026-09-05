import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/app/config';
import type { RecentTransaction } from '../types';
import { formatCurrency, formatDate, getTransactionStatusVariant } from '../utils';

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const navigate = useNavigate();

  const handleNavigateToDocument = (txn: RecentTransaction) => {
    const ref = txn.reference.toUpperCase();
    const type = txn.type.toLowerCase();
    if (ref.startsWith('INV') || type.includes('invoice')) {
      navigate(`/invoices/${txn.id}`);
    } else if (ref.startsWith('BILL') || type.includes('bill')) {
      navigate(`/bills/${txn.id}`);
    } else if (ref.startsWith('PAY') || type.includes('payment')) {
      navigate(`/payments/${txn.id}`);
    } else if (ref.startsWith('SO') || type.includes('sale')) {
      navigate(`/sales/${txn.id}`);
    } else if (ref.startsWith('PO') || type.includes('purchase')) {
      navigate(`/purchases/${txn.id}`);
    } else if (ref.startsWith('JE') || type.includes('journal')) {
      navigate(ROUTES.ACCOUNTING_ENTRIES);
    } else {
      navigate(ROUTES.ACCOUNTING);
    }
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-body text-navy-400">
            Your financial activity will appear here once transactions are recorded.
          </p>
          <Link to={ROUTES.SALES_NEW} className="mt-3 inline-block">
            <Button variant="outline" size="sm">
              Create First Sale
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Link to={ROUTES.ACCOUNTING}>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        {/* Desktop table */}
        <div className="hidden md:block overflow-auto">
          <table className="w-full text-body">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="px-5 py-2.5 text-left text-caption font-medium text-navy-400">
                  Reference
                </th>
                <th className="px-5 py-2.5 text-left text-caption font-medium text-navy-400">
                  Type
                </th>
                <th className="px-5 py-2.5 text-left text-caption font-medium text-navy-400">
                  Party
                </th>
                <th className="px-5 py-2.5 text-left text-caption font-medium text-navy-400">
                  Date
                </th>
                <th className="px-5 py-2.5 text-right text-caption font-medium text-navy-400">
                  Amount
                </th>
                <th className="px-5 py-2.5 text-left text-caption font-medium text-navy-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  onClick={() => handleNavigateToDocument(txn)}
                  className="border-b border-surface-border last:border-0 transition-colors hover:bg-surface-secondary cursor-pointer"
                  title={`View details for ${txn.reference}`}
                >
                  <td className="px-5 py-3 font-medium text-navy-700 font-mono text-caption">
                    {txn.reference}
                  </td>
                  <td className="px-5 py-3 text-navy-500">{txn.type}</td>
                  <td className="px-5 py-3 text-navy-600">{txn.party}</td>
                  <td className="px-5 py-3 text-navy-400">{formatDate(txn.date)}</td>
                  <td className="px-5 py-3 text-right font-medium text-navy-700 tabular-nums">
                    {formatCurrency(txn.amount)}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={getTransactionStatusVariant(txn.status)}>
                      {txn.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout */}
        <div className="md:hidden divide-y divide-surface-border">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              onClick={() => handleNavigateToDocument(txn)}
              className="px-5 py-3 space-y-1.5 cursor-pointer hover:bg-surface-secondary transition-colors"
              title={`View details for ${txn.reference}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-caption font-medium text-navy-700">
                  {txn.reference}
                </span>
                <Badge variant={getTransactionStatusVariant(txn.status)}>
                  {txn.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-body">
                <span className="text-navy-500">{txn.type}</span>
                <span className="font-medium text-navy-700 tabular-nums">
                  {formatCurrency(txn.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-caption text-navy-400">
                <span>{txn.party}</span>
                <span>{formatDate(txn.date)}</span>
              </div>
            </div>
          ))}
        </div>

      </CardContent>

      <CardFooter className="md:hidden justify-center">
        <Link to={ROUTES.ACCOUNTING}>
          <Button variant="ghost" size="sm">
            View All Transactions
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
