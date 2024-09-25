"use client"; // Enables client-side rendering for this component

import { useState, useEffect, ChangeEvent } from "react"; // Import React hooks and types
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"; // Import custom Card components
import { Label } from "@/components/ui/label"; // Import custom Label component
import { Input } from "@/components/ui/input"; // Import custom Input component
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"; // Import custom Select components
import { Button } from "@/components/ui/button"; // Import custom Button component
import ClipLoader from "react-spinners/ClipLoader";

// Define the ExchangeRates type
type ExchangeRates = {
  [key: string]: number;
};

// Define the Currency type
type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
  const [targetCurrency, setTargetCurrency] = useState<Currency>("PKR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        setError("Error fetching exchange rates.");
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(parseFloat(e.target.value));
  };

  const handleSourceCurrencyChange = (value: Currency): void => {
    setSourceCurrency(value);
  };

  const handleTargetCurrencyChange = (value: Currency): void => {
    setTargetCurrency(value);
  };

  const calculateConvertedAmount = (): void => {
    if (sourceCurrency && targetCurrency && amount && exchangeRates) {
      const rate =
        sourceCurrency === "USD"
          ? exchangeRates[targetCurrency]
          : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];
      const result = amount * rate;
      setConvertedAmount(result.toFixed(2));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200"> {/* Light gray background */}
      <Card className="w-full max-w-md p-6 space-y-4 bg-white rounded-lg shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#1e3a8a]"> {/* Dark blue */}
            Currency Converter
          </CardTitle>
          <CardDescription className="text-[#4b5563]"> {/* Medium gray */}
            Convert between different currencies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader className="w-6 h-6 text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-[#dc2626] text-center">{error}</div>
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <Label htmlFor="from" className="text-[#4b5563]"> {/* Medium gray */}
                  From
                </Label>
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amount || ""}
                    onChange={handleAmountChange}
                    className="w-full"
                    id="from"
                  />
                  <Select
                    value={sourceCurrency}
                    onValueChange={handleSourceCurrencyChange}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <Label htmlFor="to" className="text-[#4b5563]"> {/* Medium gray */}
                  To
                </Label>
                <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                  <div className="text-2xl font-bold text-[#000000]">{convertedAmount}</div> {/* Bold black for result */}
                  <Select
                    value={targetCurrency}
                    onValueChange={handleTargetCurrencyChange}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="EUR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-lightpurple-600 focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={calculateConvertedAmount}
          >
            Convert
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
