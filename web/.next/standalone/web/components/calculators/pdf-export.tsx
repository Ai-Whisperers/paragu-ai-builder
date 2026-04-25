'use client'

interface CalculatorPDFData {
  calculatorName: string
  locale: string
  results: Record<string, unknown>
  timestamp?: string
}

const PDF_TEMPLATES: Record<string, (data: CalculatorPDFData) => string> = {
  'tax-savings': (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tax Savings Report - Paraguay</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; }
        h1 { color: #1E3A5F; font-size: 24px; margin-bottom: 8px; }
        h2 { color: #666; font-size: 14px; font-weight: normal; margin-bottom: 24px; }
        .result-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .result-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .result-row:last-child { border-bottom: none; }
        .result-label { color: #666; }
        .result-value { font-weight: 600; }
        .savings { color: #2E7D32; font-size: 28px; font-weight: bold; }
        .disclaimer { font-size: 11px; color: #999; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>Tax Savings Report</h1>
      <h2>Generated: ${data.timestamp || new Date().toLocaleDateString()}</h2>
      
      <div class="result-box">
        <div class="result-row">
          <span class="result-label">Current Country Tax</span>
          <span class="result-value">${data.results.currentTax || '€0'}</span>
        </div>
        <div class="result-row">
          <span class="result-label">Paraguay Tax</span>
          <span class="result-value">${data.results.paraguayTax || '€0'}</span>
        </div>
        <div class="result-row">
          <span class="result-label">Annual Savings</span>
          <span class="result-value savings">${data.results.savings || '€0'}</span>
        </div>
        <div class="result-row">
          <span class="result-label">5-Year Savings</span>
          <span class="result-value">${data.results.fiveYear || '€0'}</span>
        </div>
      </div>
      
      <div class="disclaimer">
        <strong>Disclaimer:</strong> This report is for illustration only and does not constitute tax advice. 
        Actual tax obligations depend on double-taxation treaties, residency status, and individual circumstances. 
        Please consult a qualified tax advisor before making any decisions.
      </div>
    </body>
    </html>
  `,
  
  'cost-of-living': (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cost of Living Report - Asunción</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; }
        h1 { color: #1E3A5F; font-size: 24px; margin-bottom: 8px; }
        h2 { color: #666; font-size: 14px; font-weight: normal; margin-bottom: 24px; }
        .result-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .result-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .result-row:last-child { border-bottom: none; }
        .result-label { color: #666; }
        .result-value { font-weight: 600; }
        .budget { color: #1E3A5F; font-size: 28px; font-weight: bold; }
        .savings { color: #2E7D32; }
        .neighborhood { margin-top: 16px; padding: 12px; background: #e8f5e9; border-radius: 6px; }
      </style>
    </head>
    <body>
      <h1>Cost of Living Report</h1>
      <h2>Asunción, Paraguay · Generated: ${data.timestamp || new Date().toLocaleDateString()}</h2>
      
      <div class="neighborhood">
        <strong>Recommended:</strong> ${data.results.neighborhood || 'Villa Morra'}
      </div>
      
      <div class="result-box">
        <div class="result-row">
          <span class="result-label">Monthly Budget</span>
          <span class="result-value budget">${data.results.budget || '$0'}</span>
        </div>
        <div class="result-row">
          <span class="result-label">vs ${data.results.compareCity || 'Amsterdam'}</span>
          <span class="result-value savings">Save ${data.results.savings || '$0'}/mo</span>
        </div>
        <div class="result-row">
          <span class="result-label">Rent (2BR)</span>
          <span class="result-value">${data.results.rent || '$0'}</span>
        </div>
        <div class="result-row">
          <span class="result-label">With School</span>
          <span class="result-value">${data.results.withSchool || 'N/A'}</span>
        </div>
      </div>
    </body>
    </html>
  `,
  
  'roi': (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Investment ROI Report - Paraguay</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a; }
        h1 { color: #1E3A5F; font-size: 24px; }
        h2 { color: #666; font-size: 14px; font-weight: normal; margin-bottom: 24px; }
        .result-box { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .result-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .result-value { font-weight: 600; }
        .roi { color: #2E7D32; font-size: 24px; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Investment ROI Report</h1>
      <h2>Generated: ${data.timestamp || new Date().toLocaleDateString()}</h2>
      
      <div class="result-box">
        <div class="result-row">
          <span>Investment</span>
          <span class="result-value">${data.results.investment || '$0'}</span>
        </div>
        <div class="result-row">
          <span>Annual Return</span>
          <span class="result-value roi">${data.results.annualReturn || '$0'}</span>
        </div>
        <div class="result-row">
          <span>5-Year Projection</span>
          <span class="result-value">${data.results.fiveYear || '$0'}</span>
        </div>
        <div class="result-row">
          <span>Tax Savings vs NL/DE</span>
          <span class="result-value" style="color:#2E7D32">${data.results.taxSavings || '$0'}</span>
        </div>
      </div>
    </body>
    </html>
  `,
}

export function openCalculatorPDF(data: CalculatorPDFData): void {
  const template = PDF_TEMPLATES[data.calculatorName]
  
  if (!template) {
    console.error('No PDF template for:', data.calculatorName)
    return
  }

  const html = template({
    ...data,
    timestamp: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  })

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}

export function generatePDFDownloadLink(data: CalculatorPDFData): string {
  const template = PDF_TEMPLATES[data.calculatorName]
  if (!template) return ''
  
  const html = template({
    ...data,
    timestamp: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  })
  
  const blob = new Blob([html], { type: 'text/html' })
  return URL.createObjectURL(blob)
}