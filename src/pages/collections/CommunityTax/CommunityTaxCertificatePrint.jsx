import React from 'react';

const CommunityTaxCertificatePrint = React.forwardRef(
  ({ certificate }, ref) => {
    if (!certificate) return null;

    return (
      <div
        ref={ref}
        className="bg-white p-12 text-black text-base"
        style={{ width: 700, margin: '0 auto', fontFamily: 'monospace' }}
      >
        <div className="flex justify-between mb-2">
          <div>
            <div className="font-semibold">Angadanan</div>
          </div>
          <div className="text-right">
            <span>{certificate.DateIssued || '22 08 2025'}</span>
          </div>
        </div>
        <div className="mb-2">
          {certificate.TaxpayerName || 'Leivan Jake Baguio'}
        </div>
        <div className="mb-2">{certificate.Address || 'Washington street'}</div>
        <div className="flex mb-2">
          <div style={{ width: '30%' }}>
            {certificate.Nationality || 'Afghan'}
          </div>
          <div style={{ width: '20%' }}>
            {certificate.Income
              ? certificate.Income.toLocaleString()
              : '24,132,654.00'}
          </div>
          <div style={{ width: '30%' }}>
            {certificate.PlaceOfBirth || 'Sultan Kudarat'}
          </div>
          <div style={{ width: '20%' }}>{certificate.Height || '200 cm'}</div>
        </div>
        <div className="flex mb-2">
          <div style={{ width: '30%' }}>
            {certificate.Occupation || 'Garbage Collector'}
          </div>
          <div style={{ width: '20%' }}>
            {certificate.Status === 'Approved' ? '✓' : ''}
          </div>
          <div style={{ width: '30%' }}>
            {certificate.BirthDate || '00 12:00:00AM'}
          </div>
          <div style={{ width: '10%' }}>{certificate.Weight || '50 kg'}</div>
          <div style={{ width: '10%' }}>
            {certificate.OtherMetric || '5.00'}
          </div>
        </div>
        <div className="flex mb-2">
          <div className="flex-1">{certificate.Amount1 || '64,000.00'}</div>
          <div className="flex-1">{certificate.Amount2 || '64.00'}</div>
        </div>
        <div className="flex mb-2">
          <div className="flex-1">{certificate.Amount3 || '25,000.00'}</div>
          <div className="flex-1">{certificate.Amount4 || '25.00'}</div>
        </div>
        <div className="flex mb-2">
          <div className="flex-1">{certificate.Amount5 || '3,000.00'}</div>
          <div className="flex-1">{certificate.Amount6 || '3.00'}</div>
        </div>
        <div>{certificate.Total1 || '111.72'}</div>
        <div>{certificate.Percentage || '16 %'}</div>
        <div>{certificate.Total2 || '111.72'}</div>
        <div className="mt-6 font-bold">
          {certificate.AmountInWords ||
            'ONE HUNDRED AND ELEVEN PESOS AND 72/100'}
        </div>
      </div>
    );
  }
);

export default CommunityTaxCertificatePrint;
