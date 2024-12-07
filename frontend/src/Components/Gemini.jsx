import React from 'react';

function Gemini({ content }) {
  const { dish, recipe } = content;


  return (
    <div className="mx-auto py-10 lg:w-2/4 md:w-2/3 sm:w-2/3 px-5 w-full">
      {dish && <h2 className="text-xl font-bold mb-4">Dish: {dish}</h2>}
      {recipe && (
        <>
          <h3 className="text-lg font-semibold">Recipe Title: {recipe.Title}</h3>
          <h4 className="font-semibold mt-4">Ingredients:</h4>
          <ul className="list-disc pl-5">
            {recipe.Ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h4 className="font-semibold mt-4">Method:</h4>
          <ol className="list-decimal pl-5">
            {recipe.Method.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <h4 className="font-semibold mt-4">Tips:</h4>
          <ul className="list-disc pl-5">
            {recipe.Tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Gemini;
