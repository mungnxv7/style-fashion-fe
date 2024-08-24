import { IAttributeValue } from "../types/productType";

export const formartCurrency = (number?: number) => {
  return number?.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};
export const formartRating = (number?: number) => {
  return (number as number) * 20;
};

export const showSpinner = () => {
  const spinnerElement = document.getElementById("spinner");
  if (spinnerElement) {
    spinnerElement.style.display = "flex";
  }
};
export const hiddenSpinner = () => {
  const spinnerElement = document.getElementById("spinner");

  if (spinnerElement) {
    spinnerElement.style.display = "none";
  }
};

export function debounce<T extends any[]>(func: (...args: T) => void, delay: number): (...args: T) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: T) {
    clearTimeout(timeoutId!);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export const visilibitySpiner = (isLoading: boolean) => {
  if (isLoading) {
    showSpinner();
  } else {
    hiddenSpinner();
  }
};

export const getNameVariants = (tier_variant: IAttributeValue[]): string => {
  let nameVariant: string = "";
  tier_variant.forEach((variant, index) => {
    if (index > 0) {
      nameVariant += ` - ${variant.name}`;
    } else {
      nameVariant += variant.name;
    }
  });
  return nameVariant;
};
