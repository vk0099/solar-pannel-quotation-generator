import React from 'react';
import { QuotationData } from '../types';
import { BUSINESS_INFO, DEFAULT_BOM } from '../constants';
import { Phone, Mail, MapPin, Globe, CheckCircle2, FileText } from 'lucide-react';

interface Props {
  data: QuotationData;
}

const PageWrapper: React.FC<{ children: React.ReactNode; isLast?: boolean }> = ({ children }) => (
  <div 
    className="bg-white overflow-hidden p-0 m-0"
    style={{ 
      width: '210mm',
      height: '297mm',
      boxSizing: 'border-box',
      display: 'block',
      position: 'relative',
      WebkitPrintColorAdjust: 'exact'
    }}
  >
    {/* Header - Fixed Height */}
    <div className="relative pt-8 px-12 pb-6" style={{ height: '160px' }}>
      <div className="absolute top-0 left-0 w-full h-12 flex">
        <div className="bg-[#22c55e] h-full flex-grow"></div>
        <div className="bg-[#d1d5db] h-full w-24 -skew-x-[45deg] origin-top transform"></div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white shadow-md rounded-2xl flex items-center justify-center p-2 border border-gray-100 overflow-hidden bg-white">
              <img 
                src="logo.png" 
                alt="Aashika Solar Logo" 
                className="block w-full h-full object-contain"
                style={{ minWidth: '40px', minHeight: '40px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.logo-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'logo-fallback font-black text-[#166534] text-2xl';
                    fallback.innerText = 'AS';
                    parent.appendChild(fallback);
                  }
                }}
              />
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-black text-[#166534] leading-tight tracking-tight">{BUSINESS_INFO.name}</h1>
          <p className="text-xs font-extrabold text-gray-600 uppercase tracking-widest">{BUSINESS_INFO.tagline}</p>
          <p className="text-[11px] text-gray-400 font-mono mt-2 font-bold">GST: {BUSINESS_INFO.gst}</p>
        </div>
      </div>
      
      <div className="h-[2px] bg-[#22c55e] w-full mt-4"></div>
    </div>

    {/* Content Area - Calculated based on 297mm total height */}
    <div className="px-12 overflow-hidden" style={{ height: 'calc(297mm - 160px - 130px)' }}>
      {children}
    </div>

    {/* Footer - Fixed Height */}
    <div className="relative h-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
            <div className="bg-[#d1d5db] h-20 w-full"></div>
            <div className="absolute bottom-0 right-0 h-24 w-1/3 bg-[#22c55e] transform -skew-x-[40deg] origin-bottom translate-x-12"></div>
        </div>
        <div className="relative z-10 px-12 pt-4 grid grid-cols-2 gap-4 text-[10px] font-medium text-gray-700">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Phone size={12} className="text-gray-900" />
                    <span className="font-bold">{BUSINESS_INFO.phone1}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail size={12} className="text-gray-900" />
                    <span className="font-bold">{BUSINESS_INFO.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Globe size={12} className="text-gray-900" />
                    <span className="font-bold">www.aashikasolar.com</span>
                </div>
            </div>
            <div className="space-y-1 text-right">
                <div className="flex items-center justify-end gap-2">
                    <MapPin size={12} className="text-gray-900 shrink-0" />
                    <span className="leading-tight font-bold">{BUSINESS_INFO.address}</span>
                </div>
                <div className="font-black text-[#166534] mt-1 uppercase text-[9px] tracking-wider">{BUSINESS_INFO.branch}</div>
            </div>
        </div>
    </div>
  </div>
);

const QuotationPDF: React.FC<Props> = ({ data }) => {
  const formatCurrency = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

  return (
    <div 
      id="pdf-content-root"
      className="flex flex-col gap-0 p-0 m-0 border-none bg-white text-left" 
      style={{ 
        width: '100%', 
        lineHeight: 0
      }}
    >
      <PageWrapper>
        <div className="text-right text-xs font-bold mb-6 text-gray-500" style={{ lineHeight: '1.5' }}>
          <p>Quotation No: {data.quotationNo}</p>
          <p>Date: {data.date}</p>
        </div>

        <div className="text-center mb-8" style={{ lineHeight: '1.2' }}>
          <h2 className="text-3xl font-black text-[#1e3a8a] mb-2 uppercase tracking-tight">{data.specs.capacityKw} KW Solar Rooftop Power Plant</h2>
          <div className="h-1.5 w-24 bg-orange-500 mx-auto mb-4 rounded-full"></div>
          <p className="text-lg font-bold text-[#1e3a8a] opacity-80 italic">Top Con WAAREE/ADANI Solar Modules by Aashika Solar Systems</p>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm" style={{ lineHeight: '1.5' }}>
          <section className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 shadow-sm">
            <h3 className="font-black text-[#1e3a8a] text-base mb-3 border-l-4 border-orange-500 pl-4 uppercase tracking-wider">System Specifications</h3>
            <div className="grid grid-cols-2 gap-y-3 pl-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Total Capacity</p>
                <p className="text-base font-black text-gray-800">{data.specs.capacityKw} kWp</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Panel Count</p>
                <p className="text-base font-black text-gray-800">{data.specs.panelCount} Modules</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Module Power</p>
                <p className="text-base font-black text-gray-800">{data.specs.moduleWattage} Wp Each</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Total Power</p>
                <p className="text-base font-black text-gray-800">{Math.round(data.specs.totalWattage).toLocaleString()} Wp</p>
              </div>
            </div>
          </section>

          <section className="bg-green-50/50 p-4 rounded-3xl border border-green-100 shadow-sm">
            <h3 className="font-black text-[#166534] text-base mb-3 border-l-4 border-[#22c55e] pl-4 uppercase tracking-wider">Estimated Yield</h3>
            <div className="grid grid-cols-3 gap-y-2 pl-4 text-center">
              <div>
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Daily</p>
                <p className="text-xl font-black text-green-700">{data.specs.dailyProduction} <span className="text-[10px] opacity-60">Units</span></p>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Monthly</p>
                <p className="text-xl font-black text-green-700">{data.specs.monthlyProduction} <span className="text-[10px] opacity-60">Units</span></p>
              </div>
              <div>
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Annually</p>
                <p className="text-xl font-black text-green-700">{data.specs.annualProduction.toLocaleString()} <span className="text-[10px] opacity-60">Units</span></p>
              </div>
            </div>
          </section>

          <section className="p-5 border-2 border-gray-100 rounded-[32px] bg-white">
            <h3 className="font-black text-gray-800 text-base mb-3 border-l-4 border-gray-900 pl-4 uppercase tracking-wider">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="font-bold text-gray-500 uppercase text-[10px] tracking-widest">Total Project Cost</span>
                <span className="font-black text-lg text-gray-900">{formatCurrency(data.costing.totalCost)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <span className="font-bold text-green-600 uppercase text-[10px] tracking-widest">Govt. Subsidy (Max)</span>
                <span className="font-black text-lg text-green-600">(-) {formatCurrency(data.costing.subsidy)}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                <span className="font-black uppercase tracking-[0.2em] text-[11px] text-green-400">Net Customer Investment</span>
                <span className="font-black text-2xl">{formatCurrency(data.costing.netCost)}</span>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-6 bg-orange-50 p-4 rounded-[28px] border border-orange-100">
             <div className="bg-orange-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-orange-200 shrink-0">ROI</div>
             <div>
                <p className="text-base font-black text-orange-900">Estimated Payback: {data.costing.roiYears} Years</p>
                <p className="text-[10px] text-orange-700 font-bold uppercase tracking-widest mt-1">Free Electricity for remaining ~21 Years</p>
             </div>
          </div>
        </div>
      </PageWrapper>

      <PageWrapper>
        <h2 className="text-2xl font-black text-[#1e3a8a] text-center mb-4 uppercase tracking-widest" style={{ lineHeight: '1.5' }}>Detailed Bill of Material (BOM)</h2>
        <div className="overflow-hidden rounded-[32px] border border-gray-200 mb-5 shadow-sm bg-white" style={{ lineHeight: '1.5' }}>
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="p-3.5 text-left font-black uppercase tracking-[0.15em] w-1/3">Core Component</th>
                  <th className="p-3.5 text-left font-black uppercase tracking-[0.15em]">Technical Details & Brand</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_BOM.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 font-black text-gray-800 border-t border-gray-100">{item.item}</td>
                    <td className="p-3 text-gray-600 border-t border-gray-100 leading-snug font-medium">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <div className="grid grid-cols-2 gap-4" style={{ lineHeight: '1.5' }}>
            <section className="bg-orange-50 p-4 rounded-[32px] border border-orange-100 shadow-inner">
                <h3 className="font-black text-orange-800 text-xs mb-3 uppercase tracking-widest text-center">Standard Warranty Terms</h3>
                <ul className="space-y-2.5 text-[10px] font-bold text-orange-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-orange-600" />
                    <span>SOLAR MODULES: 12 Years Product / 25 Years Performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-orange-600" />
                    <span>INVERTER: 10 Year Comprehensive Manufacturer Warranty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-orange-600" />
                    <span>STRUCTURE: 5 Year Mechanical Integrity Warranty</span>
                  </li>
                </ul>
            </section>
            <section className="bg-blue-50 p-4 rounded-[32px] border border-blue-100 flex flex-col items-center justify-center text-center">
                <h3 className="font-black text-blue-800 text-xs mb-2 uppercase tracking-widest">Installation Timeline</h3>
                <div className="bg-white/50 p-3 rounded-2xl w-full border border-blue-200">
                    <p className="text-3xl font-black text-blue-900 tracking-tighter">30 to 45</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 mt-1">Business Days</p>
                </div>
                <p className="text-[9px] mt-3 font-bold text-blue-800 opacity-60 italic leading-tight">Subject to DISCOM Approval and Material Availability</p>
            </section>
        </div>
      </PageWrapper>

      <PageWrapper>
        <div className="space-y-6 text-sm" style={{ lineHeight: '1.5' }}>
          <section>
            <h3 className="font-black text-xl mb-6 text-gray-900 uppercase tracking-[0.2em] border-b-4 border-green-500 pb-2 inline-block">Payment Milestones</h3>
            <div className="grid grid-cols-3 gap-4">
               {[
                 { p: "50%", t: "ORDER CONFIRMATION", d: "Advance payment with P.O." },
                 { p: "40%", t: "MATERIAL DISPATCH", d: "Before delivery to site" },
                 { p: "10%", t: "COMMISSIONING", d: "On net metering completion" }
               ].map((item, i) => (
                 <div key={i} className="text-center p-5 rounded-3xl bg-white border-2 border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                    <p className="text-2xl font-black text-green-600 mb-1">{item.p}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-2">{item.t}</p>
                    <p className="text-[9px] text-gray-400 font-bold leading-tight">{item.d}</p>
                 </div>
               ))}
            </div>
          </section>
          
          <section className="bg-orange-50 p-6 rounded-[40px] shadow-lg border-2 border-orange-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="font-black text-lg mb-6 uppercase tracking-[0.15em] text-orange-800 relative z-10">Terms and Conditions</h3>
            <div className="grid grid-cols-1 gap-2 text-[11px] font-bold leading-relaxed relative z-10">
              {[
                "25 Years Performance warranty on Modules as per manufacturer policy.",
                "Quotation is valid for a period of 15 days from the date of issuance.",
                "Civil works (concrete/roofing) are customer's responsibility unless specified.",
                "All statutory approvals are subject to government processing times.",
                "System performance depends on shade-free area and regular cleaning.",
                "Price is inclusive of standard GST and basic freight costs.",
                "Insurance of the system after installation is recommended to the client.",
                "Net metering application will be initiated post 100% payment receipt."
              ].map((term, i) => (
                <div key={i} className="flex items-start gap-4 border-b border-orange-100 pb-2 last:border-0">
                  <span className="text-orange-600 font-black">●</span>
                  <span className="text-orange-900 font-medium">{term}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
            <h3 className="font-black text-blue-900 text-sm mb-4 uppercase tracking-wider flex items-center gap-3">
                <FileText className="text-blue-600" size={18} />
                Documents Required
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Aadhar Card", sub: "ID Proof" },
                { label: "PAN Card", sub: "Tax Proof" },
                { label: "Electricity Bill", sub: "Latest Month" }
              ].map((doc, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center shadow-sm">
                  <div className="mb-2 bg-blue-50 p-2 rounded-full">
                     <CheckCircle2 size={14} className="text-blue-500" />
                  </div>
                  <p className="font-black text-gray-800 text-[10px] uppercase mb-1">{doc.label}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{doc.sub}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageWrapper>

      <PageWrapper isLast={true}>
        <div className="space-y-4" style={{ lineHeight: '1.5' }}>
          <section className="relative overflow-hidden bg-green-50 p-6 rounded-[40px] shadow-lg border-2 border-green-200">
             <div className="relative z-10">
                <h3 className="font-black text-xl mb-4 uppercase tracking-[0.2em] text-green-800">Bank Details for Remittance</h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                   <div className="space-y-3">
                      <div>
                         <p className="text-[9px] uppercase font-black text-green-600 tracking-[0.3em] mb-1">Account Holder</p>
                         <p className="font-black text-lg text-green-900">{BUSINESS_INFO.name}</p>
                      </div>
                      <div>
                         <p className="text-[9px] uppercase font-black text-green-600 tracking-[0.3em] mb-1">Account Number</p>
                         <p className="font-black text-xl tracking-[0.1em] text-green-700">{BUSINESS_INFO.accountNo}</p>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div>
                         <p className="text-[9px] uppercase font-black text-green-600 tracking-[0.3em] mb-1">Bank Name</p>
                         <p className="font-black text-base text-green-900">{BUSINESS_INFO.bankName} - {BUSINESS_INFO.bankBranch}</p>
                      </div>
                      <div>
                         <p className="text-[9px] uppercase font-black text-green-600 tracking-[0.3em] mb-1">IFSC Code</p>
                         <p className="font-black text-xl tracking-[0.1em] text-green-700">{BUSINESS_INFO.ifsc}</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-green-100/50 rounded-full blur-3xl"></div>
          </section>

          <div className="flex justify-between items-end pt-4">
            <div className="max-w-xs">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Valued Client Information</p>
              <div className="space-y-1.5 border-l-8 border-green-600 pl-6">
                <p className="font-black text-xl text-gray-900 leading-none">{data.client.name}</p>
                <p className="text-xs font-bold text-gray-500 leading-snug">{data.client.address}</p>
                <p className="text-xs font-black text-green-700 mt-2 bg-green-50 inline-block px-2.5 py-1 rounded-lg">PH: +91 {data.client.mobile}</p>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <div className="mb-4 flex flex-col items-end">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Authorized for Issuance</p>
                <div className="w-56 h-16 border-4 border-gray-50 rounded-[24px] mb-2 flex items-center justify-center italic text-gray-200 text-xs font-bold border-dashed">
                    Official Stamp & Signature
                </div>
              </div>
              <p className="font-black text-lg text-[#166534]">For {BUSINESS_INFO.name}</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <div className="inline-block px-10 py-2 bg-gray-50 rounded-full border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] shadow-inner">
                Empowering the Future with Clean Energy
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default QuotationPDF;