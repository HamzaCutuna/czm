"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CustomDatePickerProps {
  open: boolean;
  date: Date;
  onOpenChange: (open: boolean) => void;
  onConfirm: (date: Date) => void;
}

export default function CustomDatePicker({ open, date, onOpenChange, onConfirm }: CustomDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(date);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, date.getMonth()));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(2024, currentMonth.getMonth(), day);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    const todayIn2024 = new Date(2024, today.getMonth(), today.getDate());
    setSelectedDate(todayIn2024);
    setCurrentMonth(new Date(2024, today.getMonth()));
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onOpenChange(false);
  };

  const renderCalendar = () => {
    const month = currentMonth.getMonth();
    const year = 2024;
    const daysInCurrentMonth = daysInMonth(month, year);
    const firstDayOfMonth = getFirstDayOfMonth(month, year);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month;
      const isToday = new Date().getDate() === day && new Date().getMonth() === month;
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-9 w-9 rounded-md text-sm font-medium transition-colors focus-ring ${
            isSelected
              ? "bg-[--color-primary] text-white hover:bg-[--color-primary]"
              : isToday
              ? "bg-stone-100 text-stone-900 hover:bg-stone-200"
              : "text-stone-700 hover:bg-stone-100"
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-sm">
        <DialogHeader>
          <DialogTitle>Odaberite datum</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevMonth}
              className="h-8 w-8 bg-stone-100 hover:bg-stone-200 rounded-md p-0 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium font-body">
              {monthNames[currentMonth.getMonth()]}
            </span>
            <button
              onClick={handleNextMonth}
              className="h-8 w-8 bg-stone-100 hover:bg-stone-200 rounded-md p-0 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="h-9 w-9 flex items-center justify-center text-xs font-medium text-stone-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <button
            onClick={handleToday}
            className="px-4 py-2 rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
          >
            Danas
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md bg-[--color-primary] text-white hover:bg-[--color-primary]/90 transition-colors"
          >
            Primijeni
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
