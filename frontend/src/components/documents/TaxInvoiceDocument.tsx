import React from 'react';
import { Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PrintableDocumentItem {
  id?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface PrintableDocumentProps {
  documentType: 'INVOICE' | 'BILL';
  documentNumber: string;
  date: string;
  dueDate: string;
  partnerName: string;
  partnerEmail?: string;
  partnerMobile?: string;
  partnerAddress?: string;
  status: string;
  lines: PrintableDocumentItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  journalReference?: string;
  onClose: () => void;
}

export const TaxInvoiceDocument: React.FC<PrintableDocumentProps> = ({
  documentType,
  documentNumber,
  date,
  dueDate,
  partnerName,
  partnerEmail,
  partnerMobile,
  partnerAddress,
  status,
  lines,
  subtotal,
  taxTotal,
  grandTotal,
  amountPaid,
  balanceDue,
  journalReference,
  onClose,
}) => {
  const isInvoice = documentType === 'INVOICE';
  const halfTax = Number((taxTotal / 2).toFixed(2));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 p-2 sm:p-4 overflow-y-auto">
      {/* Container - on print this fills the A4 page */}
      <div className="relative w-full max-w-3xl rounded-lg bg-white shadow-2xl overflow-hidden print:m-0 print:w-full print:max-w-none print:shadow-none print:rounded-none">
        {/* Screen-only action bar */}
        <div className="flex items-center justify-between border-b border-surface-border bg-surface-secondary/60 px-6 py-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
              Printable {isInvoice ? 'Tax Invoice' : 'Vendor Bill'}
            </span>
            <span className="text-xs text-navy-400 font-mono">{documentNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800"
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* The Printable A4 Sheet */}
        <div className="p-8 sm:p-10 print:p-6 text-navy-900 font-sans text-xs" id="printable-voucher">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-brand-700 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-brand-700 text-white font-bold flex items-center justify-center text-sm">
                  UL
                </div>
                <h1 className="text-xl font-bold tracking-tight text-navy-900">URBAN LEDGER</h1>
              </div>
              <p className="text-[11px] font-semibold text-brand-700 mt-0.5">Urban Furniture Private Limited</p>
              <p className="text-navy-500 mt-1 text-[11px]">
                Plot 42, Peenya Industrial Area, Phase II<br />
                Bangalore, Karnataka — 560058, India<br />
                GSTIN: <span className="font-mono font-medium">29AABCU1234F1Z5</span> | State Code: 29
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-navy-900 text-white font-bold text-xs rounded uppercase tracking-wider">
                {isInvoice ? 'TAX INVOICE' : 'VENDOR BILL'}
              </span>
              <div className="mt-2 space-y-0.5 text-[11px]">
                <p>
                  <span className="text-navy-400">{isInvoice ? 'Invoice No:' : 'Bill No:'}</span>{' '}
                  <span className="font-mono font-bold text-navy-900">{documentNumber}</span>
                </p>
                <p>
                  <span className="text-navy-400">Date:</span>{' '}
                  <span className="font-semibold text-navy-800">{date}</span>
                </p>
                <p>
                  <span className="text-navy-400">Due Date:</span>{' '}
                  <span className="font-semibold text-navy-800">{dueDate}</span>
                </p>
                {journalReference && (
                  <p>
                    <span className="text-navy-400">Journal Ref:</span>{' '}
                    <span className="font-mono text-brand-700">{journalReference}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Party Details */}
          <div className="grid grid-cols-2 gap-6 my-5 p-3 rounded bg-surface-secondary/40 border border-surface-border text-[11px]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block mb-1">
                {isInvoice ? 'Billed To (Customer):' : 'Billed By (Vendor):'}
              </span>
              <p className="font-bold text-sm text-navy-900">{partnerName}</p>
              {partnerAddress && <p className="text-navy-600 mt-0.5">{partnerAddress}</p>}
              {partnerEmail && <p className="text-navy-500 mt-0.5 font-mono">{partnerEmail}</p>}
              {partnerMobile && <p className="text-navy-500 font-mono">{partnerMobile}</p>}
            </div>

            <div className="text-right flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block mb-1">
                  Place of Supply:
                </span>
                <p className="font-semibold text-navy-800">Karnataka (State Code: 29)</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block mb-0.5">
                  Payment Status:
                </span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                  status === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'OVERDUE'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Table of Line Items */}
          <table className="w-full border-collapse my-4 text-left text-xs">
            <thead>
              <tr className="border-y-2 border-navy-900 bg-surface-secondary/80 text-[11px] font-bold text-navy-800 uppercase tracking-wider">
                <th className="py-2 px-2 text-center w-8">#</th>
                <th className="py-2 px-3">Item Description</th>
                <th className="py-2 px-2 text-center w-16">HSN/SAC</th>
                <th className="py-2 px-2 text-center w-12">Qty</th>
                <th className="py-2 px-3 text-right w-24">Rate (₹)</th>
                <th className="py-2 px-3 text-right w-24">Taxable (₹)</th>
                <th className="py-2 px-3 text-right w-24">GST 18%</th>
                <th className="py-2 px-3 text-right w-28">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {lines.map((l, index) => (
                <tr key={l.id || index} className="text-[11px]">
                  <td className="py-2 px-2 text-center text-navy-400">{index + 1}</td>
                  <td className="py-2 px-3 font-semibold text-navy-900">{l.name}</td>
                  <td className="py-2 px-2 text-center text-navy-400 font-mono">9403</td>
                  <td className="py-2 px-2 text-center font-semibold">{l.quantity}</td>
                  <td className="py-2 px-3 text-right font-mono">₹{l.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-mono">₹{l.subtotal.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-mono text-navy-600">₹{l.tax.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-navy-900">
                    ₹{l.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tax & Total Summary */}
          <div className="grid grid-cols-2 gap-6 pt-3 border-t-2 border-navy-900">
            {/* Bank remittance details */}
            <div className="space-y-2 text-[11px]">
              <div className="rounded border border-surface-border bg-surface-secondary/40 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy-600 block mb-1">
                  Bank Remittance / NEFT / RTGS Details:
                </span>
                <p><span className="text-navy-400">Bank Name:</span> HDFC Bank</p>
                <p><span className="text-navy-400">Account Name:</span> Urban Furniture Private Limited</p>
                <p><span className="text-navy-400">Account No:</span> <span className="font-mono font-bold">50200098765432</span></p>
                <p><span className="text-navy-400">IFSC Code:</span> <span className="font-mono font-bold">HDFC0001234</span></p>
                <p><span className="text-navy-400">UPI VPA:</span> <span className="font-mono font-bold">urbanfurniture@hdfcbank</span></p>
              </div>

              <p className="text-[10px] text-navy-400 italic">
                * Note: This is an official computer-generated Tax Invoice issued under Section 31 of CGST Act.
              </p>
            </div>

            {/* Total figures */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-0.5 text-navy-600">
                <span>Subtotal (Taxable Value):</span>
                <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-0.5 text-navy-600">
                <span>CGST (9.00%):</span>
                <span className="font-mono">₹{halfTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-0.5 text-navy-600">
                <span>SGST (9.00%):</span>
                <span className="font-mono">₹{halfTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-t border-navy-900 text-sm font-bold text-navy-900">
                <span>Total Amount Due:</span>
                <span className="font-mono text-brand-700">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-0.5 font-semibold text-emerald-700">
                <span>Amount Paid:</span>
                <span className="font-mono">₹{amountPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-dashed border-surface-border font-bold text-rose-700">
                <span>Outstanding Balance:</span>
                <span className="font-mono">₹{balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Signatory Footer */}
          <div className="mt-8 pt-6 border-t border-surface-border flex justify-between items-end text-[11px] text-navy-500">
            <div>
              <p>Terms & Conditions:</p>
              <ol className="list-decimal list-inside text-[10px] text-navy-400 space-y-0.5">
                <li>Goods once delivered as per specification cannot be returned without prior consent.</li>
                <li>Interest @ 18% p.a. will be levied for overdue settlements past 15 days.</li>
              </ol>
            </div>

            <div className="text-center w-48">
              <div className="h-10 flex items-center justify-center italic text-brand-700 font-serif text-sm">
                Urban Ledger Accounts
              </div>
              <p className="border-t border-navy-400 pt-1 text-[10px] font-semibold uppercase tracking-wider text-navy-700">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
