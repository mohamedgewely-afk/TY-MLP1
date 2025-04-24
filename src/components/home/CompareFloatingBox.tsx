
import React from 'react';
import { Button } from '@/components/ui/button';
import { CompareIcon } from 'lucide-react';

export interface CompareFloatingBoxProps {
  count: number;
  onClick: () => void;
}

const CompareFloatingBox: React.FC<CompareFloatingBoxProps> = ({ count, onClick }) => {
  return (
    <div className="fixed bottom-24 md:bottom-10 right-6 z-40">
      <Button 
        onClick={onClick}
        className="bg-toyota-red hover:bg-toyota-darkred shadow-lg rounded-full px-6 py-6 flex items-center"
      >
        <CompareIcon className="mr-2 h-5 w-5" />
        Compare {count} {count === 1 ? 'Vehicle' : 'Vehicles'}
      </Button>
    </div>
  );
};

export default CompareFloatingBox;
