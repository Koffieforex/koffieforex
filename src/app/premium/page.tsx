'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Crown, Clock } from 'lucide-react';

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl w-full text-center"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-center space-x-3">
            <Crown className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Premium Features</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Clock className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Coming Soon!</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We're working hard to bring you exclusive premium features that will enhance your trading experience.
            Stay tuned for updates!
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-1">What to expect:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Advanced trading signals</li>
                <li>• Priority customer support</li>
                <li>• Exclusive market analysis</li>
                <li>• Customizable dashboard</li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition mt-6"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}