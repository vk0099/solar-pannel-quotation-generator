
export interface ClientDetails {
  name: string;
  address: string;
  mobile: string;
}

export interface SystemSpecs {
  capacityKw: number;
  moduleWattage: number;
  panelCount: number;
  totalWattage: number;
  dailyProduction: number;
  monthlyProduction: number;
  annualProduction: number;
}

export interface Costing {
  totalCost: number;
  subsidy: number;
  netCost: number;
  perUnitCost: number;
  dailySavings: number;
  monthlySavings: number;
  annualSavings: number;
  roiYears: number;
}

export interface QuotationData {
  quotationNo: string;
  date: string;
  client: ClientDetails;
  specs: SystemSpecs;
  costing: Costing;
}

export interface BOMItem {
  item: string;
  description: string;
}
