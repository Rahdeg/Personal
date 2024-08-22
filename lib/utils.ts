import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency(
  value: number,
  currency: string = "NGN"
): string {
  return Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export function fillMissingDays(
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionsByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found;
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0,
      };
    }
  });

  return transactionsByDay;
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(
      defaultTo,
      "LLL dd, y"
    )}`;
  }

  if (period.to) {
    return `${format(period.from, "LLL dd")} - ${format(
      period.to,
      "LLL dd, y"
    )}`;
  }

  return format(period.from, "LLL dd, y");
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {
    addPrefix: false,
  }
) {
  const result = new Intl.NumberFormat("en-NG", {
    style: "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}

export function modifyEndpointContent(data: any) {
  // Modify the price to a string
  data.costPrice = data.costPrice?.toString();
  data.sellingPrice = data.sellingPrice?.toString();
  data.quantity = data.quantity?.toString();

  // Transform the images array into an array of objects with a 'url' property
  data.images = data.images.map((imageUrl: any) => ({ url: imageUrl }));

  return data;
}

export const getMatchingIds = (
  colors: string[],
  data: { label: string; value: string }[]
): string[] => {
  return data
    .filter((item) => colors.includes(item.label))
    .map((item) => item.value);
};

export function transformImages(product: Product): any {
  return {
    ...product,
    images: product.images.map((image: any) => ({ url: image })),
  };
}

export function formatAmount(amount: number, currency: string = "NGN"): string {
  // Create a new Intl.NumberFormat instance for the specified currency
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Format the amount (assuming the amount is in the smallest unit like kobo, cents, etc.)
  return formatter.format(amount / 100);
}
