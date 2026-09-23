import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Package, ShoppingBag } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import Button from "../components/ui/Button";
import { formatCurrency } from "../utils/formatCurrency";

const METHOD_LABELS = {
  card: "Credit / Debit Card",
  upi: "UPI",
  netbanking: "Net Banking",
};

const PaymentConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, method, last4, total } = location.state ?? {};

  // Guard
  if (!orderId) {
    return (
      <PageWrapper>
        <div className="py-24 text-center flex flex-col items-center gap-4">
          <p className="text-gray-500">No payment record found.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-lg flex flex-col gap-6">

          {/* Success card */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
              <p className="mt-1 text-sm text-gray-500">
                Your payment has been authorised and your order is being processed.
              </p>
            </div>
          </div>

          {/* Payment details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">Payment Details</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide">Amount Paid</dt>
                <dd className="font-bold text-gray-900 text-lg mt-0.5">{formatCurrency(total)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide">Method</dt>
                <dd className="font-medium text-gray-900 mt-0.5">
                  {METHOD_LABELS[method] ?? method}
                  {method === "card" && last4 !== "0000" && (
                    <span className="ml-1 text-gray-500">ending ···· {last4}</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide">Order ID</dt>
                <dd className="font-medium text-gray-900 font-mono mt-0.5">{orderId}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 uppercase tracking-wide">Status</dt>
                <dd className="mt-0.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    <CheckCircle2 size={11} /> Authorised
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              fullWidth
              onClick={() =>
                navigate("/order/confirmation", {
                  state: { orderId },
                })
              }
            >
              <Package size={16} />
              View Order Confirmation
              <ArrowRight size={15} />
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate("/books")}>
              <ShoppingBag size={16} />
              Continue Shopping
            </Button>
          </div>

          {/* Support note */}
          <p className="text-center text-xs text-gray-400">
            A confirmation email has been sent to your registered address.
            Need help? <Link to="#" className="text-[#1e3a5f] hover:underline">Contact support</Link>
          </p>

        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentConfirmationPage;
