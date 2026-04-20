'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, DollarSign, Home, Percent } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface MortgageResult {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  downPayment: number
  loanAmount: number
}

export function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState<number>(150000)
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20)
  const [interestRate, setInterestRate] = useState<number>(8.5)
  const [loanTerm, setLoanTerm] = useState<number>(20)

  const calculateMortgage = useCallback((): MortgageResult => {
    const downPayment = homePrice * (downPaymentPercent / 100)
    const loanAmount = homePrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    let monthlyPayment: number
    if (interestRate === 0) {
      monthlyPayment = loanAmount / numberOfPayments
    } else {
      monthlyPayment = 
        loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    }

    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - loanAmount

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount)
    }
  }, [homePrice, downPaymentPercent, interestRate, loanTerm])

  const result = calculateMortgage()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      maximumFractionDigits: 0
    }).format(value * 7000)
  }

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Calculadora de Hipotecas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Home Price */}
        <div className="space-y-2">
          <Label htmlFor="homePrice" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Precio de la Propiedad
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">USD</span>
            <Input
              id="homePrice"
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="flex-1"
              min={50000}
              max={2000000}
            />
          </div>
          <p className="text-sm text-gray-600">{formatUSD(homePrice)}</p>
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <Label htmlFor="downPayment" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Pago Inicial (%)
          </Label>
          <Input
            id="downPayment"
            type="number"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            min={5}
            max={50}
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{formatUSD(result.downPayment)}</span>
            <span className="text-gray-500">Préstamo: {formatUSD(result.loanAmount)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="interestRate" className="flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Tasa de Interés Anual (%)
          </Label>
          <Input
            id="interestRate"
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            min={3}
            max={15}
            step={0.1}
          />
          <p className="text-xs text-gray-500">
            Tasas típicas en Paraguay: 8% - 12%
          </p>
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label htmlFor="loanTerm">Plazo del Préstamo (años)</Label>
          <Input
            id="loanTerm"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            min={5}
            max={30}
          />
        </div>

        {/* Results */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
          <h4 className="font-semibold text-gray-900">Resultados</h4>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Cuota Mensual:</span>
            <span className="text-xl font-bold text-green-600">
              {formatUSD(result.monthlyPayment)}
            </span>
          </div>
          <p className="text-sm text-gray-500 text-right">
            ~{formatCurrency(result.monthlyPayment)}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total a Pagar:</span>
            <span className="font-semibold">{formatUSD(result.totalPayment)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Intereses:</span>
            <span className="font-semibold text-amber-600">
              {formatUSD(result.totalInterest)}
            </span>
          </div>
        </div>

        <Button className="w-full" variant="secondary">
          Solicitar Simulación Personalizada
        </Button>

        <p className="text-xs text-gray-500 text-center">
          *Esta calculadora proporciona estimaciones. Las condiciones reales 
          dependen de su perfil crediticio y el banco seleccionado.
        </p>
      </CardContent>
    </Card>
  )
}
