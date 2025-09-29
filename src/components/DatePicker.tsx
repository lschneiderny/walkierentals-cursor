"use client"

import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface RentalDatePickerProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

export function RentalDatePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  disabled = false
}: RentalDatePickerProps) {
  const [localStartDate, setLocalStartDate] = useState<Date | null>(startDate)
  const [localEndDate, setLocalEndDate] = useState<Date | null>(endDate)

  // Update local state when props change
  useEffect(() => {
    setLocalStartDate(startDate)
    setLocalEndDate(endDate)
  }, [startDate, endDate])

  const handleStartDateChange = (date: Date | null) => {
    setLocalStartDate(date)
    onStartDateChange(date)

    // If start date is after end date, reset end date
    if (date && localEndDate && date > localEndDate) {
      setLocalEndDate(null)
      onEndDateChange(null)
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    setLocalEndDate(date)
    onEndDateChange(date)
  }

  const calculateRentalDays = () => {
    if (!localStartDate || !localEndDate) return 0
    const diffTime = Math.abs(localEndDate.getTime() - localStartDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  const today = new Date()
  const defaultMinDate = minDate || today

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <DatePicker
            selected={localStartDate}
            onChange={handleStartDateChange}
            minDate={defaultMinDate}
            maxDate={maxDate}
            disabled={disabled}
            dateFormat="MMMM d, yyyy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholderText="Select start date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <DatePicker
            selected={localEndDate}
            onChange={handleEndDateChange}
            minDate={localStartDate || defaultMinDate}
            maxDate={maxDate}
            disabled={disabled || !localStartDate}
            dateFormat="MMMM d, yyyy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            placeholderText="Select end date"
          />
        </div>
      </div>

      {localStartDate && localEndDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-800">
              Rental Period: {calculateRentalDays()} day{calculateRentalDays() !== 1 ? 's' : ''}
            </span>
            <span className="text-sm font-semibold text-blue-900">
              {localStartDate.toLocaleDateString()} - {localEndDate.toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Quick date preset component for common rental periods
interface DatePreset {
  label: string
  days: number
}

interface DatePresetsProps {
  onPresetSelect: (days: number) => void
  disabled?: boolean
}

export function DatePresets({ onPresetSelect, disabled = false }: DatePresetsProps) {
  const presets: DatePreset[] = [
    { label: "1 Day", days: 1 },
    { label: "3 Days", days: 3 },
    { label: "7 Days", days: 7 },
    { label: "14 Days", days: 14 },
    { label: "30 Days", days: 30 },
  ]

  const today = new Date()

  const handlePresetClick = (days: number) => {
    if (disabled) return

    const startDate = new Date(today)
    const endDate = new Date(today)
    endDate.setDate(endDate.getDate() + days)

    // This would need to be handled by the parent component
    onPresetSelect(days)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Quick Select
      </label>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.days}
            onClick={() => handlePresetClick(preset.days)}
            disabled={disabled}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
