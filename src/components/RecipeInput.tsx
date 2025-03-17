import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';

interface RecipeInputProps {
  userData: any;
  setUserData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const RecipeInput: React.FC<RecipeInputProps> = ({
  userData,
  setUserData,
  onNext,
  onBack,
}) => {
  const [recipe, setRecipe] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData({ ...userData, recipe });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <Search className="h-8 w-8 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Find Your Recipe</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enter the dish name you'd like to make
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Chocolate Cake, Chicken Curry"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            value={recipe}
            onChange={(e) => setRecipe(e.target.value)}
          />
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
            Find Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeInput;