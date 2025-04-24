"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import mn from 'date-fns/locale/mn';


interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
}

const translations = {
  title: "Зардлын бүртгэл",
  descriptionLabel: "Тайлбар",
  amountLabel: "Дүн",
  dateLabel: "Огноо",
  categoryLabel: "Ангилал",
  addExpense: "Зардал нэмэх",
  expenseList: "Зардлын жагсаалт",
  noExpenses: "Зардал байхгүй",
  total: "Нийт",
  sortBy: "Эрэмбэлэх",
  highestAmount: "Хамгийн өндөр дүнгээр",
  lowestAmount: "Хамгийн бага дүнгээр",
  newestDate: "Хамгийн сүүлд",
  oldestDate: "Хамгийн эхэнд",
  dashboardTitle: "Зардлын Дашбоард",
};

const categories = [
  "Хүнс",
  "Тээвэр",
  "Орон сууц",
  "Харилга",
  "Эрүүл мэнд",
  "Боловсрол",
  "Бусад",
];

const COLORS = ["#82ca9d", "#8884d8", "#a4de6c", "#d0ed57", "#8dd1e1", "#82ca9d", "#a4de6c"];

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [category, setCategory] = useState(categories[0]); // Default category
  const [sortBy, setSortBy] = useState("newestDate");

  const addExpense = () => {
    if (!description || !amount || !date || !category) {
      alert("Тайлбар, дүн, огноо, ангилалыг оруулна уу."); // Please enter description, amount, date and category
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      description,
      amount,
      date,
      category,
    };

    setExpenses([...expenses, newExpense]);
    setDescription("");
    setAmount(undefined);
    setDate(undefined);
    setCategory(categories[0]); // Reset to default category
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    switch (sortBy) {
      case "highestAmount":
        return b.amount - a.amount;
      case "lowestAmount":
        return a.amount - b.amount;
      case "newestDate":
        return b.date.getTime() - a.date.getTime();
      case "oldestDate":
        return a.date.getTime() - b.date.getTime();
      default:
        return 0;
    }
  });

  const groupedExpenses = sortedExpenses.reduce((acc: { [key: string]: Expense[] }, expense) => {
    const dateKey = format(expense.date, "PPP", {locale: mn});
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {});

  const categoryTotals = expenses.reduce((acc: { [key: string]: number }, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const totalExpense = expenses.reduce((acc: number, expense) => acc + expense.amount, 0);

  const chartData = Object.entries(categoryTotals).map(([category, total]) => ({
    name: category,
    value: total,
  }));

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-secondary py-12 px-4 md:px-0">
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
                  {date ? format(date, "PPP", {locale: mn}) : <span>{translations.dateLabel}</span>}
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
          <div className="grid gap-2">
            <Label htmlFor="category">{translations.categoryLabel}</Label>
            <Select onValueChange={setCategory} defaultValue={category}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={translations.categoryLabel} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addExpense} className="w-full bg-primary text-primary-foreground hover:bg-primary/80">
            <PlusCircle className="mr-2 h-4 w-4" />
            {translations.addExpense}
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mt-8 p-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{translations.expenseList}</CardTitle>
          <Select onValueChange={setSortBy} defaultValue={sortBy}>
            <SelectTrigger>
              <SelectValue placeholder={translations.sortBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highestAmount">{translations.highestAmount}</SelectItem>
              <SelectItem value="lowestAmount">{translations.lowestAmount}</SelectItem>
              <SelectItem value="newestDate">{translations.newestDate}</SelectItem>
              <SelectItem value="oldestDate">{translations.oldestDate}</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedExpenses).length > 0 ? (
            Object.entries(groupedExpenses).map(([date, dailyExpenses]) => (
              <div key={date} className="mb-4">
                <h3 className="font-semibold text-lg">{date}</h3>
                <ul className="space-y-2">
                  {dailyExpenses.map((expense) => (
                    <li key={expense.id} className="border rounded-md p-2">
                      <div className="flex justify-between">
                        <div className="font-bold">{expense.description}</div>
                        <div>{expense.amount}₮</div>
                      </div>
                      <div className="text-sm text-muted-foreground">{expense.category}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div>{translations.noExpenses}</div>
          )}
          {expenses.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="font-bold">{translations.total}: {totalExpense}₮</div>
            </>
          )}
        </CardContent>
      </Card>

      {expenses.length > 0 && (
        <Card className="w-full max-w-md mt-8 p-4">
          <CardHeader>
            <CardTitle>{translations.dashboardTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
