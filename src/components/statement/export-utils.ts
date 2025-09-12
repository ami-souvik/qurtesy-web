import jsPDF from 'jspdf';
import { Transaction, Budget, Category, Account } from '../../types';

export interface ExportData {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  accounts: Account[];
  dateRange: {
    start: string;
    end: string;
  };
  summary: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    totalBudgeted: number;
    totalSpent: number;
  };
}

export const exportToCSV = (data: Transaction[], filename: string) => {
  const headers = ['Date', 'Type', 'Credit', 'Amount', 'Category', 'Account', 'Note'];

  const csvContent = [
    headers.join(','),
    ...data.map((transaction) =>
      [
        transaction.date,
        transaction.section,
        transaction.credit,
        transaction.amount.toString(),
        `${transaction.category?.emoji}:${transaction.category?.value || ''}`,
        transaction.account?.value || '',
        `${transaction.note || ''}`, // Wrap in quotes to handle commas
      ].join(',')
    ),
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportBudgetsToCSV = (budgets: Budget[], filename: string) => {
  const headers = [
    'Category',
    'Budgeted Amount',
    'Spent Amount',
    'Remaining Amount',
    'Percentage Used',
    'Over Budget',
    'Month',
    'Year',
  ];

  const csvContent = [
    headers.join(','),
    ...budgets.map((budget) =>
      [
        `"${budget.category.value}"`,
        budget.budgeted_amount.toString(),
        budget.spent_amount.toString(),
        budget.remaining_amount.toString(),
        budget.percentage_used.toString(),
        budget.is_over_budget.toString(),
        budget.month.toString(),
        budget.year.toString(),
      ].join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export const exportToPDF = async (exportData: ExportData, filename: string) => {
  const pdf = new jsPDF();

  // Title
  pdf.setFontSize(20);
  pdf.text('Financial Report', 105, 20, { align: 'center' });

  // Date range
  pdf.setFontSize(12);
  pdf.text(`Period: ${exportData.dateRange.start} to ${exportData.dateRange.end}`, 20, 35);

  // Summary section
  pdf.setFontSize(16);
  pdf.text('Summary', 20, 50);

  pdf.setFontSize(12);
  let yPos = 60;
  pdf.text(`Total Income: $${exportData.summary.totalIncome.toFixed(2)}`, 20, yPos);
  yPos += 8;
  pdf.text(`Total Expense: $${exportData.summary.totalExpense.toFixed(2)}`, 20, yPos);
  yPos += 8;
  pdf.text(`Net Balance: $${exportData.summary.netBalance.toFixed(2)}`, 20, yPos);
  yPos += 8;
  pdf.text(`Total Budgeted: $${exportData.summary.totalBudgeted.toFixed(2)}`, 20, yPos);
  yPos += 8;
  pdf.text(`Total Spent: $${exportData.summary.totalSpent.toFixed(2)}`, 20, yPos);

  // Budget section
  if (exportData.budgets.length > 0) {
    yPos += 20;
    pdf.setFontSize(16);
    pdf.text('Budget Overview', 20, yPos);

    yPos += 15;
    pdf.setFontSize(10);

    exportData.budgets.forEach((budget) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      const status = budget.is_over_budget ? 'OVER' : 'OK';
      const statusColor: [number, number, number] = budget.is_over_budget ? [255, 0, 0] : [0, 128, 0];

      pdf.text(`${budget.category.value}`, 20, yPos);
      pdf.text(`$${budget.spent_amount.toFixed(2)} / $${budget.budgeted_amount.toFixed(2)}`, 100, yPos);
      pdf.text(`${budget.percentage_used.toFixed(1)}%`, 150, yPos);

      pdf.setTextColor(...statusColor);
      pdf.text(status, 170, yPos);
      pdf.setTextColor(0, 0, 0);

      yPos += 8;
    });
  }

  // Save the PDF
  pdf.save(`${filename}.pdf`);
};
