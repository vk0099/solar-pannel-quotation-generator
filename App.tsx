import React, { useState, useEffect, useRef } from "react";
import { QuotationData } from "./types";
import QuotationPDF from "./components/QuotationPDF";
import { Printer, Download, X, Eye, Loader2 } from "lucide-react";

const INITIAL_DATA: QuotationData = {
  quotationNo: `ASS/2024/${Math.floor(Math.random() * 900) + 100}`,
  date: new Date().toLocaleDateString("en-GB"),
  client: {
    name: "Sri Kanama Venkatarami Reddy",
    address: "Santhi Nagar, Ananthapuramu,",
    mobile: "9676258896",
  },
  specs: {
    capacityKw: 3,
    moduleWattage: 550,
    panelCount: 6,
    totalWattage: 3300,
    dailyProduction: 13.5,
    monthlyProduction: 405,
    annualProduction: 4928,
  },
  costing: {
    totalCost: 220000,
    subsidy: 78000,
    netCost: 142000,
    perUnitCost: 8,
    dailySavings: 108,
    monthlySavings: 3240,
    annualSavings: 39420,
    roiYears: 3.6,
  },
};

const App: React.FC = () => {
  const [data, setData] = useState<QuotationData>(INITIAL_DATA);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [prepStatus, setPrepStatus] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  const printRef = useRef<HTMLDivElement>(null);

  // Effect for Physical Specs only (Wattage & Panels)
  useEffect(() => {
    const totalWattage = data.specs.capacityKw * 1000;
    const panelCount = Math.ceil(totalWattage / data.specs.moduleWattage);

    // We do NOT calculate production here anymore to allow presets to override standard math
    setData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        totalWattage,
        panelCount,
      },
    }));
  }, [data.specs.capacityKw, data.specs.moduleWattage]);

  // Effect for Financials (ROI & Savings) - purely derived from production & cost
  useEffect(() => {
    const dailySavings = data.specs.dailyProduction * data.costing.perUnitCost;
    const monthlySavings = dailySavings * 30;
    const annualSavings = dailySavings * 365;
    const netCost = data.costing.totalCost - data.costing.subsidy;
    const roiYears = annualSavings > 0 ? netCost / annualSavings : 0;

    setData((prev) => ({
      ...prev,
      costing: {
        ...prev.costing,
        dailySavings: Math.round(dailySavings),
        monthlySavings: Math.round(monthlySavings),
        annualSavings: Math.round(annualSavings),
        netCost: Math.round(netCost),
        roiYears: parseFloat(roiYears.toFixed(1)),
      },
    }));
  }, [
    data.specs.dailyProduction,
    data.costing.perUnitCost,
    data.costing.totalCost,
    data.costing.subsidy,
  ]);

  const startPreparation = () => {
    setIsPreparing(true);
    const statuses = [
      "Optimizing system configuration...",
      "Generating Bill of Materials...",
      "Calculating financial returns...",
      "Preparing PDF documents...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < statuses.length) {
        setPrepStatus(statuses[i]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsPreparing(false);
          setShowPreviewModal(true);
        }, 300);
      }
    }, 400);
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsDownloading(true);

    const element = printRef.current;

    const waitForImages = async (el: HTMLElement) => {
      const images = Array.from(el.querySelectorAll("img"));
      const promises = images.map((img) => {
        if (img.complete && typeof img.decode === "function") {
          return img.decode().catch(() => Promise.resolve());
        }
        return new Promise((resolve) => {
          img.onload = () => {
            if (typeof img.decode === "function") {
              img.decode().then(resolve).catch(resolve);
            } else {
              resolve(null);
            }
          };
          img.onerror = () => resolve(null);
        });
      });
      return Promise.all(promises);
    };

    try {
      await waitForImages(element);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const opt = {
        margin: 0,
        filename: `Solar_Quotation_${data.client.name.replace(/\s+/g, "_")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      };

      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert(
        "Failed to capture all assets. Showing browser print dialog as fallback...",
      );
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  // Handlers for manual inputs
  const handleCapacityChange = (val: number) => {
    setSelectedPreset("custom");
    // Auto-estimate production using standard factor if typing manually
    const estimatedDaily = parseFloat((val * 4.5).toFixed(1));

    setData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        capacityKw: val,
        dailyProduction: estimatedDaily,
        monthlyProduction: Math.round(estimatedDaily * 30),
        annualProduction: Math.round(estimatedDaily * 365),
      },
    }));
  };

  const handleDailyProductionChange = (val: number) => {
    setSelectedPreset("custom");
    setData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        dailyProduction: val,
        monthlyProduction: Math.round(val * 30),
        annualProduction: Math.round(val * 365),
      },
    }));
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPreset(value);

    if (value === "3kw") {
      setData((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          capacityKw: 3,
          dailyProduction: 13.5,
          monthlyProduction: 405,
          annualProduction: 4928, // Specific value requested
          moduleWattage: 550, // Defaults to ~6 panels
        },
        costing: {
          ...prev.costing,
          totalCost: 220000,
        },
      }));
    } else if (value === "5kw") {
      setData((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          capacityKw: 5,
          dailyProduction: 19,
          monthlyProduction: 570, // derived from 19*30
          annualProduction: 6840, // Specific value requested
          moduleWattage: 550, // Defaults to ~9-10 panels
        },
        costing: {
          ...prev.costing,
          totalCost: 340000,
        },
      }));
    }
  };

  const updateCost = (key: keyof typeof data.costing, value: number) => {
    setData((prev) => ({
      ...prev,
      costing: { ...prev.costing, [key]: value },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      {isPreparing && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <Loader2 size={56} className="text-green-600 animate-spin mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-2">
            System Ready
          </h2>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 overflow-hidden mb-4">
            <div className="bg-green-600 h-full animate-progress"></div>
          </div>
          <p className="text-gray-500 font-medium">{prepStatus}</p>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed inset-0 z-[110] bg-slate-900 flex flex-col overflow-hidden no-print-modal">
          <div className="h-20 bg-slate-800 border-b border-white/10 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                <Eye size={24} />
              </div>
              <div>
                <h2 className="text-white font-bold leading-none">
                  Quotation Preview
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Review your professional 4-page proposal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-xl active:scale-95"
              >
                {isDownloading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
                {isDownloading ? "Downloading..." : "Download PDF"}
              </button>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 md:p-12 flex justify-center bg-slate-950 scroll-smooth">
            <div className="origin-top transform scale-75 md:scale-90 lg:scale-100 transition-transform shadow-2xl">
              <div
                ref={printRef}
                className="bg-white"
                style={{
                  width: "210mm",
                  minHeight: "297mm",
                  margin: "0 auto",
                  background: "white",
                }}
              >
                <QuotationPDF data={data} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full md:w-96 bg-white shadow-2xl p-6 no-print overflow-y-auto max-h-screen border-r border-gray-100 shrink-0 z-10">
        <div className="flex items-center gap-3 mb-8 bg-green-50 p-4 rounded-2xl border border-green-100">
          <div className="bg-green-600 p-2.5 rounded-xl shadow-lg shadow-green-200">
            <Printer className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">
              Aashika Solar
            </h1>
            <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider mt-1">
              Admin Panel
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Quotation Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                  Quotation Number
                </label>
                <input
                  type="text"
                  value={data.quotationNo}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      quotationNo: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="ASS/2024/XXX"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={data.date}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Client Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.client.name}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      client: { ...prev.client, name: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                  Address
                </label>
                <textarea
                  rows={2}
                  value={data.client.address}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      client: { ...prev.client, address: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-white focus:ring-2 focus:ring-green-500 outline-none resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={data.client.mobile}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      client: { ...prev.client, mobile: e.target.value },
                    }))
                  }
                  className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
          </section>

          <section className="p-4 border border-gray-100 rounded-2xl shadow-sm bg-white">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Plant Size
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                  System Size Preset
                </label>
                <select
                  value={selectedPreset}
                  onChange={handlePresetChange}
                  className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-blue-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-blue-900"
                >
                  <option value="custom">Custom Configuration</option>
                  <option value="3kw">3 kWp Premium System</option>
                  <option value="5kw">5 kWp Premium System</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    KW Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={data.specs.capacityKw}
                    onChange={(e) =>
                      handleCapacityChange(parseFloat(e.target.value) || 0)
                    }
                    className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Units/Day
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={data.specs.dailyProduction}
                    onChange={(e) =>
                      handleDailyProductionChange(
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="p-4 border border-gray-100 rounded-2xl shadow-sm bg-white">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Financials
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                  Total Quote (₹)
                </label>
                <input
                  type="number"
                  value={data.costing.totalCost}
                  onChange={(e) =>
                    updateCost("totalCost", parseInt(e.target.value) || 0)
                  }
                  className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                  Subsidy (₹)
                </label>
                <input
                  type="number"
                  value={data.costing.subsidy}
                  onChange={(e) =>
                    updateCost("subsidy", parseInt(e.target.value) || 0)
                  }
                  className="w-full rounded-xl border-gray-200 sm:text-sm p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </section>

          <button
            onClick={startPreparation}
            className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-xl active:scale-[0.98] text-sm"
          >
            <Eye size={20} />
            Preview Quotation
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center py-10 px-4 overflow-y-auto h-screen bg-gray-100 no-print">
        <div className="mb-6 flex items-center gap-3 px-4 py-1.5 bg-white rounded-full shadow-sm border border-gray-200">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 font-black text-[9px] uppercase tracking-[0.2em]">
            Preview Environment
          </span>
        </div>
        <div className="opacity-20 pointer-events-none scale-75 origin-top transform-gpu blur-[2px] transition-all duration-700">
          <div
            style={{
              width: "210mm",
              minHeight: "297mm",
              margin: "0 auto",
              background: "white",
            }}
          >
            <QuotationPDF data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
