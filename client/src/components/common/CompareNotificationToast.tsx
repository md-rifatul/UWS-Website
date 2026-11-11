import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { dismissNotification } from '@/features/compare/compareSlice';

export const CompareNotificationToast: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notification, items } = useAppSelector((state) => state.compare);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(dismissNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-4 duration-200">
      <div className="bg-navy-950 text-white rounded-lg shadow-2xl p-4 border border-navy-800 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-navy-800 rounded-md text-industrial-orange shrink-0 mt-0.5">
            <Scale className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-200">{notification}</p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                to="/compare"
                onClick={() => dispatch(dismissNotification())}
                className="inline-flex items-center gap-1 text-xs font-semibold text-industrial-orange hover:text-industrial-orange-hover"
              >
                <span>View Comparison ({items.length}/4)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
        <button
          onClick={() => dispatch(dismissNotification())}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CompareNotificationToast;

