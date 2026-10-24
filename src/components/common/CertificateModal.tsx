import React, { useRef } from 'react';
import { Certificate, CertificateDesign } from '../../types';
import { store } from '../../services/store';
import { Award, CheckCircle, X, Shield, Printer, Sparkles, QrCode } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
  customDesignPreview?: CertificateDesign; // optional for admin live preview
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ 
  certificate, 
  onClose,
  customDesignPreview 
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const design = customDesignPreview || certificate.design || store.getCertificateDesign();

  const handlePrint = () => {
    window.print();
  };

  const getTemplateTheme = () => {
    switch (design.templateType) {
      case 'platinum_silver':
        return {
          bg: 'bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617]',
          border: 'border-slate-400/50',
          accent: 'text-slate-300',
          sealBg: 'bg-slate-800 border-slate-400 text-slate-200',
        };
      case 'royal_gold':
        return {
          bg: 'bg-gradient-to-br from-[#1a1508] via-[#0d0b04] to-[#050402]',
          border: 'border-amber-500/60',
          accent: 'text-amber-400',
          sealBg: 'bg-amber-950/80 border-amber-500 text-amber-300',
        };
      case 'minimal_dark':
        return {
          bg: 'bg-[#090d16]',
          border: 'border-slate-700',
          accent: 'text-white',
          sealBg: 'bg-slate-900 border-slate-600 text-slate-300',
        };
      case 'custom_upload':
      case 'electric_blue':
      default:
        return {
          bg: 'bg-gradient-to-br from-[#0c1429] via-[#080d1d] to-[#040711]',
          border: 'border-blue-500/50',
          accent: 'text-blue-400',
          sealBg: 'bg-blue-950/80 border-blue-400 text-blue-300',
        };
    }
  };

  const theme = getTemplateTheme();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#080d1a] border border-slate-700/80 shadow-2xl p-4 sm:p-8 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>Official Verifiable Academy Credential</span>
          </div>

          <div className="flex items-center gap-2 mr-8 sm:mr-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas Body */}
        <div 
          ref={certificateRef}
          style={{ borderColor: design.borderColor || undefined }}
          className={`relative rounded-xl border-4 border-double ${theme.border} ${theme.bg} p-6 sm:p-12 text-center overflow-hidden shadow-2xl min-h-[460px] flex flex-col justify-between`}
        >
          {/* Custom Uploaded Background Image (if present) */}
          {design.backgroundImageUrl && (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src={design.backgroundImageUrl}
                alt="Custom Certificate Design"
                className="w-full h-full object-cover opacity-25"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-[#040711]/60 to-transparent" />
            </div>
          )}

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: design.accentColor || '#3b82f6' }} />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: design.accentColor || '#3b82f6' }} />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: design.accentColor || '#3b82f6' }} />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: design.accentColor || '#3b82f6' }} />

          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
            <Award className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Academy Header */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div 
                className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-display font-black text-white text-sm shadow-md"
                style={{ backgroundColor: design.accentColor || '#2563eb' }}
              >
                AS
              </div>
              <span className="text-lg sm:text-xl font-bold font-display text-white tracking-wider uppercase">
                Abdala <span style={{ color: design.accentColor || '#3b82f6' }}>Silver</span> Academy
              </span>
            </div>

            {/* Custom Header Title */}
            <p 
              className="text-xs uppercase tracking-[0.2em] font-bold mb-1"
              style={{ color: design.accentColor || '#60a5fa' }}
            >
              {design.headerTitle || 'Certificate of Mastery & Creative Excellence'}
            </p>

            <p className="text-[10px] text-slate-400 mb-6">
              {design.headerSubtitle || 'For Practical Achievement in Digital Creative Disciplines'}
            </p>

            <p className="text-xs text-slate-400 mb-2">This is proudly awarded to</p>

            {/* Student Name */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white underline underline-offset-8 mb-5 decoration-blue-500/50">
              {certificate.userName}
            </h2>

            <p className="text-xs text-slate-300 max-w-lg mx-auto mb-2 leading-relaxed">
              for successfully completing all practical syllabus modules, 4K production assignments, and demonstrating professional mastery in:
            </p>

            {/* Course Title */}
            <h3 
              className="text-base sm:text-xl font-bold max-w-xl mx-auto mb-6 font-display"
              style={{ color: design.accentColor || '#93c5fd' }}
            >
              {certificate.courseTitle}
            </h3>
          </div>

          {/* Signatures & Seal Bar */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-xs">
            
            {/* Instructor Signature Area */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              {design.signatorySignatureUrl ? (
                <img
                  src={design.signatorySignatureUrl}
                  alt="Signatory Signature"
                  className="h-10 object-contain mb-1"
                />
              ) : (
                <span className="font-serif italic text-lg font-medium tracking-wide" style={{ color: design.accentColor || '#60a5fa' }}>
                  {design.signatoryName || certificate.instructorName}
                </span>
              )}
              <div className="w-36 h-px bg-slate-700 my-1" />
              <p className="text-[11px] font-semibold text-white">
                {design.signatoryName || certificate.instructorName}
              </p>
              <p className="text-[10px] text-slate-400">
                {design.signatoryTitle || 'Head of Academy & Executive Director'}
              </p>
            </div>

            {/* Academy Seal */}
            <div className="flex flex-col items-center justify-center">
              <div 
                className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center shadow-lg ${theme.sealBg}`}
                style={{ borderColor: design.accentColor || undefined }}
              >
                <Shield className="w-6 h-6" style={{ color: design.accentColor || '#3b82f6' }} />
                <span className="text-[7px] font-bold tracking-widest uppercase mt-0.5">
                  VERIFIED
                </span>
              </div>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5">
                {design.sealTitle || 'Abdala Silver Academy'}
              </span>
            </div>

            {/* Credential Data & QR Code */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
              {design.showQrCode && (
                <div className="p-1 rounded bg-white text-black mb-1.5 shadow-sm">
                  <QrCode className="w-8 h-8" />
                </div>
              )}
              <p className="text-[10px] text-slate-400">Date Issued:</p>
              <p className="text-xs font-mono font-semibold text-white">{certificate.issueDate}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Credential ID:</p>
              <p className="text-[10px] font-mono font-bold" style={{ color: design.accentColor || '#22d3ee' }}>
                {certificate.credentialId}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
