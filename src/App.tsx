import React, { useState } from 'react';
import { X, ChefHat, UtensilsCrossed, Heart, Apple } from 'lucide-react';
import UserForm from './components/UserForm';
import HealthQuestionnaire from './components/HealthQuestionnaire';
import RecipeInput from './components/RecipeInput';
import FoodPairing from './components/FoodPairing';
import ExitModal from './components/ExitModal';

function App() {
  const [step, setStep] = useState(1);
  const [showExitModal, setShowExitModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    gender: '',
    healthData: {},
    recipe: '',
  });

  const handleExit = () => {
    setShowExitModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-800">Recipe Master</h1>
          </div>
          <button
            onClick={handleExit}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {step === 1 && (
            <UserForm
              userData={userData}
              setUserData={setUserData}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <HealthQuestionnaire
              userData={userData}
              setUserData={setUserData}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <RecipeInput
              userData={userData}
              setUserData={setUserData}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <FoodPairing
              userData={userData}
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </main>

      <ExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
      />
    </div>
  );
}

export default App;