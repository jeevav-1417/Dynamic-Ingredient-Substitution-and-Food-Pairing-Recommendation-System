import React, { useState } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';

interface HealthQuestionnaireProps {
  userData: any;
  setUserData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const HealthQuestionnaire: React.FC<HealthQuestionnaireProps> = ({
  userData,
  setUserData,
  onNext,
  onBack,
}) => {
  const [healthData, setHealthData] = useState({
    isDiabetic: false,
    hasAllergies: false,
    allergies: '',
    isFitnessEnthusiast: false,
    isLactoseIntolerant: false,
    ...(userData.gender === 'female' && {
      isPregnant: false,
      hasPCOS: false,
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData({ ...userData, healthData });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <Heart className="h-8 w-8 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Health Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="diabetic"
              className="rounded text-orange-500 focus:ring-orange-500"
              checked={healthData.isDiabetic}
              onChange={(e) =>
                setHealthData({ ...healthData, isDiabetic: e.target.checked })
              }
            />
            <label htmlFor="diabetic" className="ml-2">
              Are you diabetic?
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allergies"
              className="rounded text-orange-500 focus:ring-orange-500"
              checked={healthData.hasAllergies}
              onChange={(e) =>
                setHealthData({ ...healthData, hasAllergies: e.target.checked })
              }
            />
            <label htmlFor="allergies" className="ml-2">
              Do you have any food allergies?
            </label>
          </div>

          {healthData.hasAllergies && (
            <input
              type="text"
              placeholder="List your allergies"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              value={healthData.allergies}
              onChange={(e) =>
                setHealthData({ ...healthData, allergies: e.target.value })
              }
            />
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="fitness"
              className="rounded text-orange-500 focus:ring-orange-500"
              checked={healthData.isFitnessEnthusiast}
              onChange={(e) =>
                setHealthData({
                  ...healthData,
                  isFitnessEnthusiast: e.target.checked,
                })
              }
            />
            <label htmlFor="fitness" className="ml-2">
              Are you a fitness enthusiast?
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="lactose"
              className="rounded text-orange-500 focus:ring-orange-500"
              checked={healthData.isLactoseIntolerant}
              onChange={(e) =>
                setHealthData({
                  ...healthData,
                  isLactoseIntolerant: e.target.checked,
                })
              }
            />
            <label htmlFor="lactose" className="ml-2">
              Are you lactose intolerant?
            </label>
          </div>

          {userData.gender === 'female' && (
            <>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pregnant"
                  className="rounded text-orange-500 focus:ring-orange-500"
                  checked={healthData.isPregnant}
                  onChange={(e) =>
                    setHealthData({
                      ...healthData,
                      isPregnant: e.target.checked,
                    })
                  }
                />
                <label htmlFor="pregnant" className="ml-2">
                  Are you pregnant?
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pcos"
                  className="rounded text-orange-500 focus:ring-orange-500"
                  checked={healthData.hasPCOS}
                  onChange={(e) =>
                    setHealthData({ ...healthData, hasPCOS: e.target.checked })
                  }
                />
                <label htmlFor="pcos" className="ml-2">
                  Do you have PCOS/PCOD?
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthQuestionnaire;