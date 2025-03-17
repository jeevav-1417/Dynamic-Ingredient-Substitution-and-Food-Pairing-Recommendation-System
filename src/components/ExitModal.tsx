import React from 'react';
import { Heart } from 'lucide-react';

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExitModal: React.FC<ExitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Heart className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
          <p className="text-gray-600">
            Thanks for using our recipe and food pairing system. We hope you found some delicious combinations!
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
            >
              Start Over
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitModal;