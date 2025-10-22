import React from "react";

function Gemini({ content }) {
  if (!content) return null;

  const { dish, recipe } = content;

  // Handle both lowercase (from backend) and uppercase (legacy) property names
  const ingredients = Array.isArray(recipe?.ingredients || recipe?.Ingredients) 
    ? (recipe.ingredients || recipe.Ingredients) 
    : [];
  const method = Array.isArray(recipe?.method || recipe?.Method) 
    ? (recipe.method || recipe.Method) 
    : [];
  const tips = Array.isArray(recipe?.tips || recipe?.Tips) 
    ? (recipe.tips || recipe.Tips) 
    : [];
  const title = recipe?.title || recipe?.Title;

  return (
    <div className="mx-auto py-10 lg:w-2/4 md:w-2/3 sm:w-2/3 px-5 w-full">
      {/* Dish Name */}
      {dish && (
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {dish}
        </h2>
      )}

      {/* Recipe Section */}
      {recipe ? (
        <>
          {/* Title (only if different from dish name) */}
          {title && title !== dish && (
            <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">
              {title}
            </h3>
          )}

          {/* Ingredients */}
          {ingredients.length > 0 && (
            <>
              <h4 className="font-semibold mt-6 text-lg text-gray-800">
                Ingredients:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </>
          )}

          {/* Method */}
          {method.length > 0 && (
            <>
              <h4 className="font-semibold mt-6 text-lg text-gray-800">
                Method:
              </h4>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                {method.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <>
              <h4 className="font-semibold mt-6 text-lg text-gray-800">
                Tips:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center">
          No recipe found for this dish.
        </p>
      )}
    </div>
  );
}

export default Gemini;