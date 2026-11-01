import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

type ServiceType = 'kplc' | 'airtime';

interface UtilityTransaction {
  id: string;
  type: ServiceType;
  title: string;
  account: string;
  amount: number;
  mpesaRef: string;
  token?: string;
  date: string;
}

export const UtilitiesModal: React.FC = () => {
  const { isUtilitiesModalOpen, setIsUtilitiesModalOpen, showToast } = useStore();

  // Active CTA selection: 'kplc' or 'airtime' (Safaricom only)
  const [activeService, setActiveService] = useState<ServiceType>('kplc');

  // KPLC Form State (no mpesa phone input, no kwh estimate)
  const [meterNumber, setMeterNumber] = useState('14289401923');
  const [kplcAmount, setKplcAmount] = useState<number>(500);
  const [customKplcAmount, setCustomKplcAmount] = useState('');

  // Safaricom Airtime Form State (Safaricom only)
  const [airtimePhone, setAirtimePhone] = useState('+254 700 892 019');
  const [airtimeAmount, setAirtimeAmount] = useState<number>(100);
  const [customAirtimeAmount, setCustomAirtimeAmount] = useState('');

  // Processing & Receipts
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<UtilityTransaction | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Stored Transactions in LocalStorage
  const [transactions, setTransactions] = useState<UtilityTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('savannah_kplc_airtime_txs_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'tx-1',
        type: 'kplc',
        title: 'KPLC Prepaid Token',
        account: '14289401923',
        amount: 500,
        mpesaRef: 'QKL928172WA',
        token: '4829-1920-4820-1920-5912',
        date: 'Yesterday'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('savannah_kplc_airtime_txs_v3', JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  if (!isUtilitiesModalOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    showToast('Token copied to clipboard', 'success');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handlePayKplc = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customKplcAmount ? Number(customKplcAmount) : kplcAmount;
    if (!finalAmount || finalAmount < 50) {
      showToast('Minimum KPLC token is KES 50', 'warning');
      return;
    }
    if (!meterNumber || meterNumber.length < 8) {
      showToast('Please enter an 11-digit meter number', 'warning');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const token = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const mpesaRef = `QK${Math.floor(1000000 + Math.random() * 9000000)}WA`;

      const newTx: UtilityTransaction = {
        id: `tx-${Date.now()}`,
        type: 'kplc',
        title: 'KPLC Prepaid Token',
        account: meterNumber,
        amount: finalAmount,
        mpesaRef,
        token,
        date: 'Just now'
      };

      setTransactions((prev) => [newTx, ...prev]);
      setActiveReceipt(newTx);
      showToast('KPLC Token generated successfully', 'success');
    }, 850);
  };

  const handlePayAirtime = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAirtimeAmount ? Number(customAirtimeAmount) : airtimeAmount;
    if (!finalAmount || finalAmount < 10) {
      showToast('Minimum airtime is KES 10', 'warning');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const mpesaRef = `QK${Math.floor(1000000 + Math.random() * 9000000)}SA`;

      const newTx: UtilityTransaction = {
        id: `tx-${Date.now()}`,
        type: 'airtime',
        title: 'Safaricom Airtime',
        account: airtimePhone,
        amount: finalAmount,
        mpesaRef,
        date: 'Just now'
      };

      setTransactions((prev) => [newTx, ...prev]);
      setActiveReceipt(newTx);
      showToast(`Safaricom Airtime of KES ${finalAmount} sent`, 'success');
    }, 850);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        setIsUtilitiesModalOpen(false);
        setActiveReceipt(null);
      }}
      onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
    >
      <div 
        className="relative w-full max-w-md bg-[#FCFBF8] rounded-2xl overflow-hidden shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimalist Header - No icon */}
        <div className="px-5 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-stone-900 tracking-tight">
              KPLC &amp; Airtime
            </h3>
            <p className="text-xs text-stone-500">
              Instant electricity tokens and Safaricom top-up
            </p>
          </div>

          <button
            onClick={() => {
              setIsUtilitiesModalOpen(false);
              setActiveReceipt(null);
            }}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-5 space-y-4">
          {/* RECEIPT VIEW */}
          {activeReceipt ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-[#173b28] text-white flex items-center justify-center mx-auto text-xs font-bold">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="font-display font-semibold text-sm text-stone-900">
                  Payment Successful
                </h4>
                <p className="text-xs text-stone-500 font-mono">
                  M-Pesa Ref: {activeReceipt.mpesaRef}
                </p>
              </div>

              {/* 20-digit KPLC Token Card (no kwh estimate) */}
              {activeReceipt.token && (
                <div className="p-4 bg-stone-900 text-white rounded-xl space-y-2">
                  <div className="text-xs text-stone-300 font-medium">
                    20-Digit Token
                  </div>

                  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-stone-800">
                    <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-emerald-300 select-all">
                      {activeReceipt.token}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeReceipt.token!)}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-stone-300" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Key into your prepaid CIU keypad and press Enter.
                  </p>
                </div>
              )}

              {/* Summary */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Service</span>
                  <span className="font-medium text-stone-900">{activeReceipt.title}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Account / Phone</span>
                  <span className="font-mono text-stone-900">{activeReceipt.account}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Amount</span>
                  <span className="font-mono font-bold text-stone-900">
                    KES {activeReceipt.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReceipt(null)}
                  className="flex-1 py-2.5 px-3 bg-[#173b28] hover:bg-[#122e20] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Buy Another
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUtilitiesModalOpen(false);
                    setActiveReceipt(null);
                  }}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TWO MINIMALIST CTAs: KPLC & SAFARICOM AIRTIME */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveService('kplc')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeService === 'kplc'
                      ? 'bg-[#173b28] text-white border-[#173b28] shadow-xs'
                      : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className={`text-[10px] uppercase tracking-wider font-semibold ${
                    activeService === 'kplc' ? 'text-emerald-200' : 'text-stone-400'
                  }`}>
                    Electricity
                  </div>
                  <div className={`font-display font-bold text-sm mt-0.5 ${
                    activeService === 'kplc' ? 'text-white' : 'text-stone-900'
                  }`}>
                    KPLC Tokens
                  </div>
                  <div className={`text-[11px] mt-0.5 ${
                    activeService === 'kplc' ? 'text-emerald-100' : 'text-stone-500'
                  }`}>
                    Prepaid CIU tokens
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveService('airtime')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeService === 'airtime'
                      ? 'bg-[#173b28] text-white border-[#173b28] shadow-xs'
                      : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className={`text-[10px] uppercase tracking-wider font-semibold ${
                    activeService === 'airtime' ? 'text-emerald-200' : 'text-stone-400'
                  }`}>
                    Mobile Top-Up
                  </div>
                  <div className={`font-display font-bold text-sm mt-0.5 ${
                    activeService === 'airtime' ? 'text-white' : 'text-stone-900'
                  }`}>
                    Safaricom Airtime
                  </div>
                  <div className={`text-[11px] mt-0.5 ${
                    activeService === 'airtime' ? 'text-emerald-100' : 'text-stone-500'
                  }`}>
                    Instant top-up
                  </div>
                </button>
              </div>

              {/* EXPANDED DETAILS: KPLC FORM (No mpesa input area, no kwh estimate) */}
              {activeService === 'kplc' && (
                <form onSubmit={handlePayKplc} className="p-4 bg-white rounded-xl border border-stone-200 space-y-3.5 animate-in fade-in duration-150">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <label className="font-medium text-stone-800">Meter Number</label>
                      <span className="text-[10px] text-stone-400">11 digits</span>
                    </div>
                    <input
                      type="text"
                      value={meterNumber}
                      onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="e.g. 14289401923"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFBF8] border border-stone-200 rounded-lg font-mono focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28] focus:outline-none text-stone-900"
                      required
                    />
                  </div>

                  {/* Preset Amount Chips (no kwh estimate) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-stone-800">Amount (KES)</label>

                    <div className="grid grid-cols-4 gap-1.5">
                      {[250, 500, 1000, 2000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setKplcAmount(preset);
                            setCustomKplcAmount('');
                          }}
                          className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border cursor-pointer ${
                            kplcAmount === preset && !customKplcAmount
                              ? 'bg-[#173b28] text-white border-[#173b28]'
                              : 'bg-[#FCFBF8] text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <input
                      type="number"
                      value={customKplcAmount}
                      onChange={(e) => {
                        setCustomKplcAmount(e.target.value);
                        if (e.target.value) setKplcAmount(Number(e.target.value));
                      }}
                      placeholder="Or enter custom amount in KES"
                      className="w-full px-3 py-1.5 text-xs bg-[#FCFBF8] border border-stone-200 rounded-lg font-mono focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28] focus:outline-none text-stone-900"
                      min="50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-2.5 px-4 bg-[#173b28] hover:bg-[#122e20] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Generating KPLC Token...</span>
                    ) : (
                      <>
                        <span>Buy KPLC Token · KES {(customKplcAmount ? Number(customKplcAmount) : kplcAmount).toLocaleString()}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* EXPANDED DETAILS: AIRTIME FORM (Safaricom only) */}
              {activeService === 'airtime' && (
                <form onSubmit={handlePayAirtime} className="p-4 bg-white rounded-xl border border-stone-200 space-y-3.5 animate-in fade-in duration-150">
                  {/* Safaricom Phone Number */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-stone-800">Safaricom Mobile Number</label>
                    <input
                      type="tel"
                      value={airtimePhone}
                      onChange={(e) => setAirtimePhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFBF8] border border-stone-200 rounded-lg font-mono focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28] focus:outline-none text-stone-900"
                      required
                    />
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-stone-800">Amount (KES)</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[50, 100, 250, 500].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setAirtimeAmount(preset);
                            setCustomAirtimeAmount('');
                          }}
                          className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border cursor-pointer ${
                            airtimeAmount === preset && !customAirtimeAmount
                              ? 'bg-[#173b28] text-white border-[#173b28]'
                              : 'bg-[#FCFBF8] text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <input
                      type="number"
                      value={customAirtimeAmount}
                      onChange={(e) => {
                        setCustomAirtimeAmount(e.target.value);
                        if (e.target.value) setAirtimeAmount(Number(e.target.value));
                      }}
                      placeholder="Or enter custom amount in KES"
                      className="w-full px-3 py-1.5 text-xs bg-[#FCFBF8] border border-stone-200 rounded-lg font-mono focus:ring-1 focus:ring-[#173b28] focus:border-[#173b28] focus:outline-none text-stone-900"
                      min="10"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-2.5 px-4 bg-[#173b28] hover:bg-[#122e20] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Sending Safaricom Airtime...</span>
                    ) : (
                      <>
                        <span>Top Up Safaricom Airtime · KES {(customAirtimeAmount ? Number(customAirtimeAmount) : airtimeAmount).toLocaleString()}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Minimalist History Accordion */}
              {transactions.length > 0 && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full py-2 px-3 rounded-lg bg-stone-100/70 hover:bg-stone-100 text-stone-600 text-xs font-medium flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Recent Tokens &amp; Airtime</span>
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {transactions.length} saved {showHistory ? '▲' : '▼'}
                    </span>
                  </button>

                  {showHistory && (
                    <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-900">{tx.title}</span>
                            <span className="font-mono font-bold text-stone-900">KES {tx.amount}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                            <span>{tx.account}</span>
                            <span>{tx.date}</span>
                          </div>
                          {tx.token && (
                            <div className="bg-stone-50 p-1.5 rounded flex items-center justify-between gap-1 font-mono text-[11px] text-emerald-900 font-bold">
                              <span>{tx.token}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(tx.token!)}
                                className="text-[10px] text-emerald-700 hover:underline cursor-pointer"
                              >
                                Copy
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Minimalist Footer */}
        <div className="px-5 py-3 border-t border-stone-200/80 flex items-center justify-between text-[11px] text-stone-400">
          <span>Lipa na M-Pesa</span>
          <span>Instant Token Delivery</span>
        </div>
      </div>
    </div>
  );
};
