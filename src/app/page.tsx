
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

const translations = {
  title: "Зардлын бүртгэл",
  descriptionLabel: "Тайлбар",
  amountLabel: "Дүн",
  dateLabel: "Огноо",
  addExpense: "Зардал нэмэх",
  expenseList: "Зардлын жагсаалт",
  noExpenses: "Зардал байхгүй",
};

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const addExpense = () => {
    if (!description || !amount || !date) {
      alert("Тайлбар, дүн, огноог оруулна уу."); // Please enter description, amount and date
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      amount,
      date,
    };

    setExpenses([...expenses, newExpense]);
    setDescription("");
    setAmount(undefined);
    setDate(undefined);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-secondary py-12">
      <Card className="w-full max-w-md space-y-4 p-4">
        <CardHeader>
          <CardTitle>{translations.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="description">{translations.descriptionLabel}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Тайлбар"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">{translations.amountLabel}</Label>
            <Input
              id="amount"
              type="number"
              value={amount !== undefined ? amount.toString() : ""}
              onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Дүн"
            />
          </div>
          <div className="grid gap-2">
            <Label>{translations.dateLabel}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>{translations.dateLabel}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={addExpense} className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
            <PlusCircle className="mr-2 h-4 w-4" />
            {translations.addExpense}
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mt-8 p-4">
        <CardHeader>
          <CardTitle>{translations.expenseList}</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <ul className="space-y-2">
              {expenses.map((expense) => (
                <li key={expense.id} className="border rounded-md p-2">
                  <div className="font-bold">{expense.description}</div>
                  <div>{expense.amount}₮ - {format(expense.date, "PPP")}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div>{translations.noExpenses}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
