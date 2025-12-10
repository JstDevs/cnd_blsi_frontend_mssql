import React from 'react';

const CTCCorporatePrintPreview = React.forwardRef(
  ({ certificate, vendor }, ref) => {
    if (!certificate) return null;

    return (
      <div
        ref={ref}
        style={{
          width: 700,
          margin: '0 auto',
          background: '#fff',
          color: '#222',
          fontFamily: 'monospace',
          padding: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div>Angadanan</div>
          <div>
            {certificate.DateIssued
              ? new Date(certificate.DateIssued)
                  .toLocaleDateString('en-GB')
                  .split('/')
                  .join(' ')
              : '22 08 2025'}
          </div>
        </div>
        <div>{vendor?.Name || certificate.CustomerName || 'Company Name'}</div>
        <div>
          {vendor?.StreetAddress || certificate.Address || 'Washington street'}
        </div>
        <div style={{ display: 'flex', gap: '2em', marginBottom: 10 }}>
          <div>{certificate.Nationality || 'Afghan'}</div>
          <div>
            {certificate.GrossReceipts
              ? Number(certificate.GrossReceipts).toLocaleString()
              : '24,132,654.00'}
          </div>
          <div>{certificate.PlaceOfBusiness || 'Sultan Kudarat'}</div>
          <div>{certificate.Height || '200 cm'}</div>
        </div>
        <div style={{ display: 'flex', gap: '2em', marginBottom: 10 }}>
          <div>{certificate.BusinessNature || 'Garbage Collector'}</div>
          <div>{certificate.Checked ? '✓' : ''}</div>
          <div>{certificate.TimeIssued || '00 12:00:00AM'}</div>
          <div>{certificate.Weight || '50 kg'}</div>
          <div>{certificate.OtherAmount || '5.00'}</div>
        </div>
        <div style={{ display: 'flex', gap: '3em', marginBottom: 3 }}>
          <div>{certificate.AmountA || '64,000.00'}</div>
          <div>{certificate.AmountB || '64.00'}</div>
        </div>
        <div style={{ display: 'flex', gap: '3em', marginBottom: 3 }}>
          <div>{certificate.AmountC || '25,000.00'}</div>
          <div>{certificate.AmountD || '25.00'}</div>
        </div>
        <div style={{ display: 'flex', gap: '3em', marginBottom: 3 }}>
          <div>{certificate.AmountE || '3,000.00'}</div>
          <div>{certificate.AmountF || '3.00'}</div>
        </div>
        <div>{certificate.NetTaxDue || '111.72'}</div>
        <div>{certificate.Rate || '16 %'}</div>
        <div>{certificate.NetTaxDue2 || '111.72'}</div>
        <div style={{ marginTop: 22, fontWeight: 'bold' }}>
          {certificate.AmountInWords ||
            'ONE HUNDRED AND ELEVEN PESOS AND 72/100'}
        </div>
      </div>
    );
  }
);

export default CTCCorporatePrintPreview;
