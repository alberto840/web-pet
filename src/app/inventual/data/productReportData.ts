export interface ProductReportInterfaceData {
  id: number;
  date: string;
  warehouse: string;
  name: string;
  purchasedQty: number;
  purchasedAmount: number;
  soldQty: number;
  soldAmount: number;
  prQty: number;
  prAmount: number;
  srQty: number;
  srAmount: number;
}
export const productReportData: ProductReportInterfaceData[] = [
  {
    id: 1,
    date: '01 Jan 2024',
    warehouse: 'Warehouse 1',
    name: 'China Apple',
    purchasedQty: 690,
    purchasedAmount: 3641.0,
    soldQty: 450,
    soldAmount: 6582.0,
    prQty: 100,
    prAmount: 1524.0,
    srQty: 150,
    srAmount: 2200.0,
  },
  {
    id: 2,
    date: '02 Jan 2024',
    warehouse: 'Warehouse 2',
    name: 'Australian Orange',
    purchasedQty: 800,
    purchasedAmount: 4500.0,
    soldQty: 600,
    soldAmount: 7500.0,
    prQty: 120,
    prAmount: 1800.0,
    srQty: 200,
    srAmount: 2800.0,
  },
  {
    id: 3,
    date: '03 Jan 2024',
    warehouse: 'Warehouse 1',
    name: 'Alibaba',
    purchasedQty: 500,
    purchasedAmount: 2750.0,
    soldQty: 350,
    soldAmount: 5100.0,
    prQty: 80,
    prAmount: 1400.0,
    srQty: 100,
    srAmount: 1700.0,
  },
  {
    id: 4,
    date: '04 Jan 2024',
    warehouse: 'Warehouse 2',
    name: 'Sony',
    purchasedQty: 1000,
    purchasedAmount: 6000.0,
    soldQty: 850,
    soldAmount: 9000.0,
    prQty: 150,
    prAmount: 2700.0,
    srQty: 200,
    srAmount: 3300.0,
  },
  {
    id: 5,
    date: '05 Jan 2024',
    warehouse: 'Warehouse 1',
    name: 'Lenovo',
    purchasedQty: 750,
    purchasedAmount: 4000.0,
    soldQty: 600,
    soldAmount: 7200.0,
    prQty: 100,
    prAmount: 1800.0,
    srQty: 200,
    srAmount: 3000.0,
  },
  {
    id: 6,
    date: '06 Jan 2024',
    warehouse: 'Warehouse 2',
    name: 'Asus',
    purchasedQty: 600,
    purchasedAmount: 3600.0,
    soldQty: 500,
    soldAmount:2000.0,
    prQty: 5500.0,
    prAmount: 0,
    srQty: 150,
    srAmount: 2200.0,
  },
  {
    id: 7,
    date: '07 Jan 2024',
    warehouse: 'Warehouse 1',
    name: 'Acer',
    purchasedQty: 900,
    purchasedAmount: 5000.0,
    soldQty: 750,
    soldAmount: 8100.0,
    prQty: 150,
    prAmount: 2700.0,
    srQty: 200,
    srAmount: 3300.0,
  },
  {
    id: 8,
    date: '08 Jan 2024',
    warehouse: 'Warehouse 2',
    name: 'Hp',
    purchasedQty: 1200,
    purchasedAmount: 7200.0,
    soldQty: 1000,
    soldAmount: 12000.0,
    prQty: 200,
    prAmount: 3600.0,
    srQty: 300,
    srAmount: 4800.0,
  },
  {
    id: 9,
    date: '09 Jan 2024',
    warehouse: 'Warehouse 1',
    name: 'Orange',
    purchasedQty: 450,
    purchasedAmount: 2400.0,
    soldQty: 350,
    soldAmount: 4800.0,
    prQty: 70,
    prAmount: 1300.0,
    srQty: 100,
    srAmount: 2000.0,
  },
  {
    id: 10,
    date: '10 Jan 2024',
    warehouse: 'Warehouse 4',
    name: 'T-shirt',
    purchasedQty: 600,
    purchasedAmount: 4600.0,
    soldQty: 450,
    soldAmount:2000.0,
    prQty: 5700.0,
    prAmount: 0,
    srQty: 150,
    srAmount: 2300.0,
  },
  {
    id: 11,
    date: '11 Jan 2024',
    warehouse: 'Warehouse 7',
    name: 'Rangs',
    purchasedQty: 800,
    purchasedAmount: 5000.0,
    soldQty: 550,
    soldAmount: 6500.0,
    prQty: 180,
    prAmount: 2300.0,
    srQty: 250,
    srAmount: 3700.0,
  },
];
