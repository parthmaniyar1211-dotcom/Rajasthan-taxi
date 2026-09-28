import React from 'react';
import { X, GitBranch, AlertTriangle, CheckCircle, ExternalLink, ShieldCheck, Terminal, Copy } from 'lucide-react';

interface RepoNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RepoNoticeModal: React.FC<RepoNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-amber-300 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-700 flex items-center justify-center text-amber-200">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">GitHub Repository Status</h3>
              <p className="text-xs text-amber-200 font-mono">
                parthmaniyar1211-dotcom/Rajasthan-taxi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">Repository Visibility Notice:</span> The requested repository{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">parthmaniyar1211-dotcom/Rajasthan-taxi</code>{' '}
              is currently <strong>Private</strong> or returns <strong>HTTP 404</strong> to unauthenticated requests.
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              If you have existing code you want to import:
            </h4>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside bg-stone-50 p-3.5 rounded-xl border border-slate-200">
              <li>
                Open{' '}
                <a
                  href="https://github.com/parthmaniyar1211-dotcom/Rajasthan-taxi/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 font-semibold underline inline-flex items-center gap-0.5"
                >
                  GitHub Repository Settings <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>Scroll down to the <strong>Danger Zone</strong> section.</li>
              <li>
                Click <strong>Change repository visibility</strong> and select <strong>Make Public</strong>.
              </li>
              <li>Once public, simply send the GitHub URL again and it will sync directly!</li>
            </ol>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Full Rajasthan Taxi Application Active!</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              In the meantime, we have built a complete, production-ready <strong>Rajasthan Taxi &amp; Royal Tour Services</strong> platform in this workspace with an instant fare calculator, curated heritage tour packages, vehicle fleet catalog, printable/shareable ticket generation, and travel guide.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              Continue to Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
