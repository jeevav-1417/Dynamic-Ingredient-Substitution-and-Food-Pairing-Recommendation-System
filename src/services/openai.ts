import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  benefits: string[];
}

export interface RecipeInfo {
  ingredients: string[];
  image: string;
  substitutions: Array<{
    original: string;
    substitute: string;
  }>;
  pairings: Array<{
    name: string;
    image: string;
    description: string;
  }>;
  nutrition: NutritionInfo;
}

// Expanded fallback images categorized by dish type
const FALLBACK_IMAGES = {
  MAIN_COURSE: [
    "https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg", // Grilled chicken
    "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg", // Steak
    "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg", // Fish
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" // General main
  ],
  DESSERT: [
    "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg", // Cake
    "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg", // Cookies
    "https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg" // Ice cream
  ],
  DRINK: [
    "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg", // Smoothie
    "https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg", // Juice
    "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg" // Beverage
  ],
  SIDE: [
    "https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg", // Salad
    "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg", // Roasted vegetables
    "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg" // Rice/Grains
  ],
  SOUP: [
    "https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg", // Clear soup
    "https://images.pexels.com/photos/1731535/pexels-photo-1731535.jpeg", // Creamy soup
    "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg" // Noodle soup
  ],
  PASTA: [
    "https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg", // Spaghetti
    "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg", // Pasta dish
    "https://images.pexels.com/photos/1487511/pexels-photo-1487511.jpeg" // Noodles
  ]
};

function getFallbackImage(recipe: string, type: 'main' | 'pairing'): string {
  const lowerRecipe = recipe.toLowerCase();
  let category: keyof typeof FALLBACK_IMAGES = 'MAIN_COURSE';

  // Determine category based on recipe name
  if (lowerRecipe.includes('cake') || lowerRecipe.includes('cookie') || lowerRecipe.includes('pie') || 
      lowerRecipe.includes('dessert') || lowerRecipe.includes('sweet')) {
    category = 'DESSERT';
  } else if (lowerRecipe.includes('soup') || lowerRecipe.includes('stew')) {
    category = 'SOUP';
  } else if (lowerRecipe.includes('smoothie') || lowerRecipe.includes('juice') || 
             lowerRecipe.includes('drink') || lowerRecipe.includes('beverage')) {
    category = 'DRINK';
  } else if (lowerRecipe.includes('pasta') || lowerRecipe.includes('noodle') || 
             lowerRecipe.includes('spaghetti')) {
    category = 'PASTA';
  } else if (lowerRecipe.includes('salad') || lowerRecipe.includes('side') || 
             lowerRecipe.includes('vegetable')) {
    category = 'SIDE';
  }

  // Get random image from the appropriate category
  const images = FALLBACK_IMAGES[category];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

function buildSearchQuery(dish: string, type: 'main' | 'pairing'): string {
  const cleanDish = dish.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  const terms = cleanDish.split(' ').slice(0, 3).join(' '); // Allow up to 3 terms for better specificity
  
  if (type === 'main') {
    return `${terms} food dish professional food photography gourmet plating`;
  } else {
    return `${terms} food plating gourmet presentation culinary`;
  }
}

async function getImageFromPexels(query: string, type: 'main' | 'pairing' = 'main'): Promise<string> {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
  
  if (!apiKey || apiKey === 'your-pexels-api-key-here') {
    console.warn('Pexels API key not configured. Using fallback images.');
    return getFallbackImage(query, type);
  }

  try {
    const searchQuery = buildSearchQuery(query, type);
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=20&orientation=landscape&size=large`,
      {
        headers: {
          Authorization: apiKey
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      // Filter for high-quality food photos
      const filteredPhotos = data.photos.filter((photo: any) => {
        const aspectRatio = photo.width / photo.height;
        return (
          aspectRatio >= 1.3 && // Landscape orientation
          aspectRatio <= 2 && // Not too wide
          photo.width >= 1920 && // High resolution
          !photo.url.toLowerCase().includes('table') && // Avoid generic table shots
          !photo.url.toLowerCase().includes('ingredient') && // Avoid raw ingredient shots
          !photo.url.toLowerCase().includes('kitchen') // Avoid kitchen shots
        );
      });

      if (filteredPhotos.length > 0) {
        // Get a random photo from the filtered list
        const randomIndex = Math.floor(Math.random() * filteredPhotos.length);
        return filteredPhotos[randomIndex].src.large2x;
      }
    }
    
    // If no results found or no photos match our criteria, use fallback
    return getFallbackImage(query, type);
    
  } catch (error) {
    console.error('Error fetching image from Pexels:', error);
    return getFallbackImage(query, type);
  }
}

export async function getRecipeInfo(
  recipe: string,
  healthData: any,
  missingIngredients?: string[]
): Promise<RecipeInfo> {
  try {
    const healthConditions = [];
    if (healthData.isDiabetic) healthConditions.push('diabetic');
    if (healthData.isLactoseIntolerant) healthConditions.push('lactose intolerant');
    if (healthData.isFitnessEnthusiast) healthConditions.push('fitness focused');
    if (healthData.hasAllergies) healthConditions.push(`allergic to ${healthData.allergies}`);
    if (healthData.isPregnant) healthConditions.push('pregnant');
    if (healthData.hasPCOS) healthConditions.push('has PCOS');

    const missingIngredientsPrompt = missingIngredients?.length 
      ? `\n4. Provide substitutions for these missing ingredients: ${missingIngredients.join(', ')}`
      : '';

    const prompt = `
      For the recipe "${recipe}", provide:
      1. A list of traditional ingredients
      2. Healthy substitutions considering these health conditions: ${healthConditions.join(', ')}
      3. Three complementary food pairings that would go well with this dish
      4. Detailed nutritional information and health benefits${missingIngredientsPrompt}

      Format the response as JSON with this structure:
      {
        "ingredients": ["ingredient1", "ingredient2"],
        "substitutions": [{"original": "ingredient", "substitute": "healthy alternative"}],
        "pairings": [{"name": "pairing name", "description": "why it pairs well"}],
        "nutrition": {
          "calories": "amount per serving",
          "protein": "amount per serving",
          "carbs": "amount per serving",
          "fat": "amount per serving",
          "benefits": ["health benefit 1", "health benefit 2"]
        }
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');

    // Get images from Pexels with better error handling
    const mainImage = await getImageFromPexels(recipe, 'main');
    const pairingImages = await Promise.all(
      response.pairings.map(async (pairing: any) => {
        const image = await getImageFromPexels(pairing.name, 'pairing');
        return { ...pairing, image };
      })
    );

    const recipeInfo: RecipeInfo = {
      ...response,
      image: mainImage,
      pairings: pairingImages
    };

    return recipeInfo;
  } catch (error) {
    console.error('Error getting recipe info:', error);
    return {
      ingredients: ['Error loading ingredients'],
      image: getFallbackImage(recipe, 'main'),
      substitutions: [],
      pairings: [],
      nutrition: {
        calories: 'N/A',
        protein: 'N/A',
        carbs: 'N/A',
        fat: 'N/A',
        benefits: ['Information unavailable']
      }
    };
  }
}