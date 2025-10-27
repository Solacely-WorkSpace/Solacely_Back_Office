"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { walletAPI } from "@/utils/api/wallet";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  successful: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  declined: "bg-red-100 text-red-700",
  pending: "bg-orange-100 text-orange-700",
  processing: "bg-blue-100 text-blue-700",
};

const normalizeTransactionPayload = (payload) => {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  return [];
};

const toTitleCase = (value) => {
  if (!value) {
    return "Unknown";
  }

  return value
    .toString()
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getInitials = (name, fallback) => {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }

  if (fallback) {
    return fallback.charAt(0).toUpperCase();
  }

  return "?";
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const formatCurrency = (amount, currency = "NGN") => {
  if (amount === null || amount === undefined) {
    return "—";
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return amount;
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    return `₦${numericAmount.toLocaleString()}`;
  }
};

const mapTransaction = (transaction) => {
  const createdAt =
    transaction?.created_at ||
    transaction?.createdAt ||
    transaction?.timestamp ||
    transaction?.date_created ||
    null;

  const name =
    transaction?.wallet_user ||
    transaction?.user_full_name ||
    transaction?.user_name ||
    transaction?.customer_name ||
    transaction?.user?.full_name ||
    transaction?.user?.name ||
    transaction?.user ||
    null;

  const email =
    transaction?.user_email ||
    transaction?.wallet_user_email ||
    transaction?.customer_email ||
    transaction?.email ||
    transaction?.user?.email ||
    "";

  const location =
    transaction?.property?.location ||
    transaction?.metadata?.location ||
    transaction?.meta?.location ||
    transaction?.location ||
    transaction?.address ||
    transaction?.property_location ||
    "";

  const property =
    transaction?.property?.title ||
    transaction?.property?.name ||
    transaction?.metadata?.property ||
    transaction?.meta?.property ||
    transaction?.listing_title ||
    transaction?.property_name ||
    transaction?.description ||
    "";

  const period =
    transaction?.billing_cycle ||
    transaction?.period ||
    transaction?.tenure ||
    transaction?.metadata?.period ||
    transaction?.meta?.period ||
    null;

  const status = (transaction?.status || transaction?.state || "").toString();

  const fallbackId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const id =
    transaction?.id ||
    transaction?.reference ||
    transaction?.transaction_reference ||
    `${name || "transaction"}-${createdAt || fallbackId}`;

  return {
    id,
    raw: transaction,
    name,
    email,
    createdAt,
    location,
    property,
    period,
    amount: transaction?.amount ?? transaction?.value ?? 0,
    currency:
      transaction?.currency ||
      transaction?.amount_currency ||
      transaction?.meta?.currency ||
      transaction?.metadata?.currency ||
      "NGN",
    status: status.trim().toLowerCase(),
    avatar:
      transaction?.user_avatar ||
      transaction?.avatar_url ||
      transaction?.avatar ||
      transaction?.user?.avatar,
  };
};

function AccountPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchTransactions = useCallback(
    async (page = 1, term = "") => {
      setLoading(true);
      setError(null);

      try {
        const params = { page, page_size: PAGE_SIZE };
        if (term.trim()) {
          params.search = term.trim();
        }

        const response = await walletAPI.getAdminTransactions(params);
        const parsedTransactions = normalizeTransactionPayload(response).map(
          mapTransaction,
        );

        setTransactions(parsedTransactions);

        setPagination({
          page,
          total: response?.count ?? parsedTransactions.length,
          hasNext:
            Boolean(response?.next) ||
            (response?.count ? page * PAGE_SIZE < response.count : false),
          hasPrevious: page > 1,
        });
      } catch (fetchError) {
        console.error("Error fetching admin transactions:", fetchError);
        setError(fetchError.message || "Unable to load transactions");
        setTransactions([]);
        setPagination((prev) => ({ ...prev, page: 1, total: 0 }));
        toast.error(
          "We couldn't load the latest account activity. Please try again shortly.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchTransactions(1, "");
  }, [fetchTransactions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTransactions(1, searchTerm);
    }, 400);

    return () => clearTimeout(handler);
  }, [fetchTransactions, searchTerm]);

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const searchableFields = [
        transaction.name,
        transaction.email,
        transaction.location,
        transaction.property,
        transaction.status,
        transaction.raw?.reference,
      ];

      return searchableFields
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(term));
    });
  }, [transactions, searchTerm]);

  const handlePageChange = (direction) => {
    const targetPage =
      direction === "next" ? pagination.page + 1 : pagination.page - 1;

    if (targetPage < 1) {
      return;
    }

    fetchTransactions(targetPage, searchTerm);
  };

  const renderStatusBadge = (transactionStatus) => {
    const style = STATUS_STYLES[transactionStatus] || "bg-gray-100 text-gray-700";
    return (
      <Badge className={`${style} border-0 font-medium px-2 py-1 text-xs`}>
        {toTitleCase(transactionStatus)}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search by name, email, property or reference"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-9 border-gray-200 pl-10 text-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Name/email</span>
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="-mt-1 h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Time</span>
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="-mt-1 h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Location</span>
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="-mt-1 h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Property</span>
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="-mt-1 h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="-mt-1 h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3 text-gray-400" />
                        <ChevronDown className="-mt-1 h-3 w-3 text-gray-400" />
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <tr key={`skeleton-${index}`} className="animate-pulse">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100" />
                          <div className="space-y-2">
                            <div className="h-3 w-28 rounded bg-gray-100" />
                            <div className="h-2 w-20 rounded bg-gray-100" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="h-3 w-24 rounded bg-gray-100" />
                          <div className="h-2 w-16 rounded bg-gray-100" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-3 w-16 rounded bg-gray-100" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="h-3 w-36 rounded bg-gray-100" />
                          <div className="h-2 w-24 rounded bg-gray-100" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="h-3 w-20 rounded bg-gray-100" />
                          <div className="h-2 w-12 rounded bg-gray-100" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-16 rounded bg-gray-100" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-8 w-16 rounded bg-gray-100" />
                      </td>
                    </tr>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >
                      {error || "No account activity found for the selected filters."}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={transaction.avatar || undefined}
                              alt={transaction.name || "User avatar"}
                            />
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                              {getInitials(transaction.name, transaction.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {transaction.name || "Unassigned"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {transaction.email || "No email provided"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(transaction.createdAt)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {transaction.createdAt ? `at ${formatTime(transaction.createdAt)}` : ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {transaction.location || "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {transaction.property || "—"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {transaction.raw?.property_type || transaction.raw?.property?.property_type || ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {transaction.period || transaction.raw?.frequency || ""}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {renderStatusBadge(transaction.status)}
                      </td>
                      <td className="px-4 py-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="h-8 px-3 text-xs border-purple-200 text-purple-600 hover:border-purple-300 hover:bg-purple-50"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/30 px-4 py-3">
            <div className="text-sm text-gray-600">
              {filteredTransactions.length > 0
                ? `Showing ${(pagination.page - 1) * PAGE_SIZE + 1} to ${(pagination.page - 1) * PAGE_SIZE + filteredTransactions.length} of ${pagination.total || filteredTransactions.length} results`
                : "No results to display"}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs text-gray-600 border-gray-300 hover:bg-gray-50"
                onClick={() => handlePageChange("previous")}
                disabled={!pagination.hasPrevious || loading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs text-gray-600 border-gray-300 hover:bg-gray-50"
                onClick={() => handlePageChange("next")}
                disabled={!pagination.hasNext || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet
        open={Boolean(selectedTransaction)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTransaction(null);
          }
        }}
      >
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            {selectedTransaction && (
              <SheetDescription>
                Reference: {selectedTransaction.raw?.reference || selectedTransaction.id}
              </SheetDescription>
            )}
          </SheetHeader>

          {selectedTransaction && (
            <div className="px-1 pb-6 space-y-5">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900">Summary</p>
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    {renderStatusBadge(selectedTransaction.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span>{formatDate(selectedTransaction.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span>{formatTime(selectedTransaction.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Customer
                  </p>
                  <p className="font-medium text-gray-900">
                    {selectedTransaction.name || "Unassigned"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedTransaction.email || "No email provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Location
                  </p>
                  <p>{selectedTransaction.location || "—"}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Property
                  </p>
                  <p>{selectedTransaction.property || "—"}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Period
                  </p>
                  <p>{selectedTransaction.period || selectedTransaction.raw?.frequency || "—"}</p>
                </div>

                {selectedTransaction.raw?.description && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Notes
                    </p>
                    <p>{selectedTransaction.raw.description}</p>
                  </div>
                )}

                {selectedTransaction.raw?.meta && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Metadata
                    </p>
                    <pre className="mt-1 max-h-40 overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-700">
                      {JSON.stringify(selectedTransaction.raw.meta, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Raw payload
                </p>
                <pre className="mt-2 max-h-64 overflow-auto rounded border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
                  {JSON.stringify(selectedTransaction.raw, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <SheetFooter className="border-t border-gray-100 pt-4">
            <SheetClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AccountPage;