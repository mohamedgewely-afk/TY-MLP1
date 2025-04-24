import React from 'react';
import { Button } from '@/components/ui/button';
import { VehicleModel } from '@/types/vehicle';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export interface PreOwnedSectionProps {
  vehicles?: VehicleModel[];
}

const PreOwnedSection: React.FC<PreOwnedSectionProps> = ({ vehicles = [] }) => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Toyota Certified Pre-Owned
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Quality pre-owned vehicles that meet Toyota's high standards for quality and reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Rigorous Inspection</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Every Toyota Certified Pre-Owned vehicle undergoes a comprehensive 160-point quality assurance inspection.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <li>• Engine and transmission</li>
                <li>• Brakes and suspension</li>
                <li>• Interior and exterior condition</li>
                <li>• Electronic systems</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Extended Warranty</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enjoy peace of mind with our comprehensive warranty coverage on all certified pre-owned vehicles.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <li>• 12-month/20,000 km comprehensive warranty</li>
                <li>• 7-year/130,000 km powertrain warranty</li>
                <li>• 24-hour roadside assistance</li>
                <li>• Transferable benefits</li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Special Financing</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Take advantage of exclusive financing options available only for Toyota Certified Pre-Owned vehicles.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <li>• Competitive interest rates</li>
                <li>• Flexible payment terms</li>
                <li>• Special APR programs</li>
                <li>• No down payment options</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-toyota-red hover:bg-toyota-darkred"
          >
            <a href="/pre-owned" className="flex items-center">
              View Pre-Owned Inventory
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PreOwnedSection;
