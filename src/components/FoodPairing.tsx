import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, ArrowLeft, Loader2, Apple, Heart, Plus } from 'lucide-react';
import { getRecipeInfo, type RecipeInfo } from '../services/openai';

interface FoodPairingProps {
  userData: any;
  onBack: () => void;
}

const FoodPairing: React.FC<FoodPairingProps> = ({ userData, onBack }) => {
  const [showPairings, setShowPairings] = useState(false);
  const [recipeData, setRecipeData] = useState<RecipeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingIngredient, setMissingIngredient] = useState('');
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);
  const [showMissingForm, setShowMissingForm] = useState(false);

  const fetchRecipeData = async (ingredients?: string[]) => {
    try {
      setLoading(true);
      const data = await getRecipeInfo(userData.recipe, userData.healthData, ingredients);
      setRecipeData(data);
    } catch (err) {
      setError('Failed to load recipe information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeData();
  }, [userData.recipe, userData.healthData]);

  const handleAddMissingIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (missingIngredient.trim()) {
      const updatedIngredients = [...missingIngredients, missingIngredient.trim()];
      setMissingIngredients(updatedIngredients);
      setMissingIngredient('');
      fetchRecipeData(updatedIngredients);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-white"></div>
          </div>
        </div>
        <p className="text-gray-600 text-lg font-medium">Creating your perfect recipe...</p>
        <p className="text-gray-500 text-sm">Analyzing ingredients and health preferences</p>
      </div>
    );
  }

  if (error || !recipeData) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <UtensilsCrossed className="h-10 w-10 text-orange-500" />
          <h2 className="text-3xl font-bold text-gray-800">Recipe & Pairings</h2>
        </div>
        <p className="text-gray-600">Personalized for your dietary needs</p>
      </div>

      <div className="grid gap-8">
        {/* Recipe Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl transform transition-all hover:scale-[1.02]">
          <div className="relative h-80">
            <img
              src={recipeData.image}
              alt={userData.recipe}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <h3 className="absolute bottom-4 left-6 text-3xl font-bold text-white">
              {userData.recipe}
            </h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Nutrition Section */}
            <div className="bg-orange-50 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Apple className="h-6 w-6 text-orange-500" />
                <h4 className="text-xl font-semibold text-gray-800">Nutritional Information</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="text-lg font-bold text-orange-500">{recipeData.nutrition.calories}</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Protein</p>
                  <p className="text-lg font-bold text-orange-500">{recipeData.nutrition.protein}</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Carbs</p>
                  <p className="text-lg font-bold text-orange-500">{recipeData.nutrition.carbs}</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Fat</p>
                  <p className="text-lg font-bold text-orange-500">{recipeData.nutrition.fat}</p>
                </div>
              </div>
            </div>

            {/* Health Benefits */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-orange-500" />
                <h4 className="text-xl font-semibold text-gray-800">Health Benefits</h4>
              </div>
              <div className="grid gap-3">
                {recipeData.nutrition.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-green-50 p-4 rounded-lg">
                    <span className="w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h4>
              <ul className="grid gap-2">
                {recipeData.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center space-x-2 text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Ingredients Form */}
            <div className="border-t pt-6">
              <button
                onClick={() => setShowMissingForm(!showMissingForm)}
                className="flex items-center space-x-2 text-orange-500 hover:text-orange-600"
              >
                <Plus className="h-5 w-5" />
                <span>Missing an ingredient?</span>
              </button>
              
              {showMissingForm && (
                <form onSubmit={handleAddMissingIngredient} className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={missingIngredient}
                      onChange={(e) => setMissingIngredient(e.target.value)}
                      placeholder="Enter missing ingredient"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                      Add
                    </button>
                  </div>
                  {missingIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {missingIngredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Substitutions */}
            {recipeData.substitutions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-800">Healthy Substitutions</h4>
                <div className="grid gap-3">
                  {recipeData.substitutions.map((sub, index) => (
                    <div key={index} className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        Replace <span className="font-medium text-orange-700">{sub.original}</span> with{' '}
                        <span className="font-medium text-green-700">{sub.substitute}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Food Pairings */}
        <div className="space-y-6">
          <button
            onClick={() => setShowPairings(!showPairings)}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
          >
            {showPairings ? 'Hide' : 'Show'} Perfect Pairings
          </button>

          {showPairings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recipeData.pairings.map((pairing, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all hover:scale-[1.02]">
                  <div className="relative h-48">
                    <img
                      src={pairing.image}
                      alt={pairing.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <h4 className="absolute bottom-3 left-4 text-xl font-bold text-white">
                      {pairing.name}
                    </h4>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600">{pairing.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition duration-200 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Recipe
        </button>
      </div>
    </div>
  );
};

export default FoodPairing;