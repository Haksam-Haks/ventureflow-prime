"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Download, Loader2 } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from "react-hot-toast";


interface Transaction {
  id: string;
  bookingId: string;
  customer: string;
  business: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
}

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await apiService().sendPostToServer('admin/transactions', { search: searchTerm || undefined, status: selectedStatus !== 'all' ? selectedStatus : undefined }) as { transactions: Transaction[] };
        
        // More robust data validation
        if (!response) {
          throw new Error('No response from server');
        }

        const transactionsData = response.transactions ?? [];

        if (!Array.isArray(transactionsData)) {
          console.warn('Unexpected transactions data format:', transactionsData);
          throw new Error('Invalid transactions data format');
        }

        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(transaction => {
      if (!transaction) return false;
      
      const searchFields = [
        transaction.customer?.toLowerCase() || '',
        transaction.business?.toLowerCase() || '',
        transaction.bookingId?.toLowerCase() || '',
        transaction.paymentMethod?.toLowerCase() || ''
      ];

      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchFields.some(field => field.includes(searchTermLower));
      const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, selectedStatus]);

  const handleExport = async () => {
    try {
      setExportLoading(true);
      const response = await apiService().sendPostToServer('admin/transactions/export', {});

      if (!response) {
        throw new Error('No data received for export');
      }

      // More robust blob creation
      const blob = new Blob(
        [response instanceof Blob ? response : JSON.stringify(response)],
        { type: 'text/csv;charset=utf-8;' }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions_export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Export successful');
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error('Failed to export transactions');
    } finally {
      setExportLoading(false);
    }
  };

  return (
  <div className="min-h-screen w-full">
      <div className="w-full h-full backdrop-blur-lg bg-white/20 rounded-none shadow-xl overflow-hidden border border-white/30 flex">
        {/* Main Content */}
        <div className="flex-1 p-8 backdrop-blur-sm bg-white/10 flex flex-col min-h-full">
          <main className="w-full">
            <h1 className="text-2xl font-bold text-[#0079C1] mb-6">Admin Transactions</h1>
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={handleExport}
                className="flex items-center rounded bg-gradient-to-r from-[#0079C1] to-[#00AEEF] px-4 py-2 text-sm font-medium text-white hover:from-[#00AEEF] hover:to-[#0079C1] shadow"
                disabled={exportLoading}
              >
                {exportLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                Export
              </button>
            </div>
            <div className="mb-6 flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <input
                  type="text"
                  className="block w-full rounded-md border-0 bg-white/80 py-2 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#0079C1] focus:ring-offset-2"
                  placeholder="Search by customer, business, booking ID, or payment method"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-[#0079C1]/60" />
                </div>
              </div>
              <button
                className="relative z-10 inline-flex items-center rounded-md border border-[#0079C1]/30 bg-white/80 px-4 py-2 text-sm font-medium text-[#0079C1] shadow-sm hover:bg-[#0079C1]/10 focus:ring-2 focus:ring-[#0079C1] focus:ring-offset-2 ml-2"
                onClick={() => setSelectedStatus(selectedStatus === 'all' ? 'completed' : 'all')}
              >
                {selectedStatus === 'all' ? 'Show Completed' : 'Show All'}
                <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#0079C1]" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="rounded-lg bg-white/80 p-6 text-center text-[#0079C1]/80 shadow border border-white/60">
                No transactions found.
                {/* Powered by footer inside card */}
                <div className="w-full flex flex-col items-center justify-center py-4 px-2 text-center bg-transparent mt-6">
                  <span className="text-sm font-semibold text-[#0079C1] drop-shadow-sm mb-1">
                    Powered by <span className="text-[#00AEEF]"> Nepserv Consults Ltd</span>
                  </span>
                  <span className="text-xs text-[#0079C1] space-x-1">
                    <span>© 2025 Nepserv Consults Ltd. All rights reserved.</span>
                    <a href="#" className="underline hover:text-[#00AEEF] ml-1">Terms of Use</a>
                    <span className="mx-1 text-[#0079C1]">|</span>
                    <a href="#" className="underline hover:text-[#00AEEF]">Privacy Policy</a>
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white/80 shadow border border-white/60">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#0079C1]/20">
                    <thead className="bg-white/10">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80">Booking ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80">Customer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80">Business</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase text-[#0079C1]/80">Payment Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#0079C1]/10 bg-white/10">
                      {filteredTransactions.map(transaction => (
                        <tr key={transaction.id} className="hover:bg-[#0079C1]/5">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0079C1]/80">{transaction.id}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0079C1]/80">{transaction.bookingId}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0079C1]/80">{transaction.customer}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0079C1]/80">{transaction.business}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0079C1]/80">{transaction.amount}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0079C1]/60">{new Date(transaction.date).toLocaleString()}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                              transaction.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : transaction.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0079C1]/80">{transaction.paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Powered by footer inside card */}
                <div className="w-full flex flex-col items-center justify-center py-4 px-2 text-center bg-transparent mt-6">
                  <span className="text-sm font-semibold text-[#0079C1] drop-shadow-sm mb-1">
                    Powered by <span className="text-[#00AEEF]"> Nepserv Consults Ltd</span>
                  </span>
                  <span className="text-xs text-[#0079C1] space-x-1">
                    <span>© 2025 Nepserv Consults Ltd. All rights reserved.</span>
                    <a href="#" className="underline hover:text-[#00AEEF] ml-1">Terms of Use</a>
                    <span className="mx-1 text-[#0079C1]">|</span>
                    <a href="#" className="underline hover:text-[#00AEEF]">Privacy Policy</a>
                  </span>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;