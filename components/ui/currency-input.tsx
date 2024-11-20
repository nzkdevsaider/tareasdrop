"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CurrencyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  prefix?: string;
  label?: string;
  placeholder?: string;
}

export default function CurrencyInput({
  value = 0,
  onChange = () => {},
  prefix = "$",
  label = "Amount",
  placeholder = "Enter amount",
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value]);

  const formatCurrency = (val: number): string => {
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseNumber = (str: string): number => {
    return Number(str.replace(/[^\d.-]/g, ""));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^\d.]/g, "");
    const decimalCount = (newValue.match(/\./g) || []).length;

    if (decimalCount > 1) {
      newValue = newValue.replace(/\.+$/, "");
    }

    const numberValue = parseNumber(newValue);
    setDisplayValue(newValue);
    onChange(numberValue);
  };

  const handleBlur = () => {
    const numberValue = parseNumber(displayValue);
    setDisplayValue(formatCurrency(numberValue));
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Label htmlFor="currency-input">{label}</Label>
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
        <Input
          id="currency-input"
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="pl-7 pr-12"
        />
      </div>
    </div>
  );
}
