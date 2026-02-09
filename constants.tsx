
import React from 'react';
import { BOMItem } from './types';

export const BUSINESS_INFO = {
  name: "AASHIKA SOLAR SYSTEMS",
  tagline: "SOLAR EPC COMPANY",
  gst: "37AWTPG5440K2Z0",
  address: "D.No.15-17, Rajahamsa Sweet Homes, NH 44, Ananthapuramu.",
  email: "aashikasolarsystemsatp@gmail.com",
  phone1: "+91-9966995752",
  phone2: "+91-9966512901",
  branch: "Also Available in: Palakollu | Anantapur",
  bankName: "Indian Bank",
  accountNo: "8138717977",
  ifsc: "IDIB000J022",
  bankBranch: "Jinnuru"
};

export const DEFAULT_BOM: BOMItem[] = [
  { item: "Solar Panel (ALMM Approved)", description: "WAAREE/ADANI Top Con Bifacial (25 Year warranty)" },
  { item: "Inverter", description: "WAAREE (10 Year warranty)" },
  { item: "ACDB", description: "Havells/Polycab/Elmax" },
  { item: "DCDB", description: "Polycab/Elmax" },
  { item: "Wire AC", description: "Polycab/finolex 4SQMM/>5KW" },
  { item: "Wire DC", description: "Polycab/finolex 4SQMM/>5KW" },
  { item: "Earthing Kit", description: "3 Copper Bonded Rod, 17Dia, One Lighting Arrestor 5 Spike, One 15Kg Chemical Bag" },
  { item: "Net Meter & Modem", description: "Genus net meter & Modem/Smart Meter" },
  { item: "MC4 Connector", description: "As per IEC Standard" },
  { item: "Other Fitting Material", description: "L Band, L Bow, LUGS 6MM, Ring Lugs Copper, Pin Lugs 4MM Copper, T-Copper, Shadel 25mm, Conduit Pipe 25mm Polycab, Insulation Tape Anchor" },
  { item: "Structure", description: "Pre GI Material 150 x 40mm & 41 x 41mm, 2mm Thickness. & Corrosive Resistance GI Structure" }
];
