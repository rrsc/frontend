export interface DashboardMetrics {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockProducts: number;
  pendingOrders: number;
  monthlySales: MonthlySales[];
  topProducts: TopProduct[];
}

export interface MonthlySales {
  month: string;
  sales: number;
  revenue: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  sales: number;
  revenue: number;
}

export interface SalesReport {
  period: {
    start: Date;
    end: Date;
  };
  totalSales: number;
  totalRevenue: number;
  averageSale: number;
  salesByCategory: SalesByCategory[];
  salesByPaymentMethod: SalesByPaymentMethod[];
}

export interface SalesByCategory {
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
}

export interface SalesByPaymentMethod {
  method: PaymentMethod;
  sales: number;
  revenue: number;
  percentage: number;
}
