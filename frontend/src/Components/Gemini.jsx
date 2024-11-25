import React from 'react';

function Gemini({ content }) {
  return (
    <div className='mx-auto lg:w-2/4 md:w-2/3 sm:w-2/3 w-full'>
      {content.map((item, index) => {
        if (typeof item === 'string') {
          return <p key={index}>{item}</p>;
        } else if (typeof item === 'object') {
          // Handle different object types (e.g., lists, code blocks)
          if (Array.isArray(item)) {
            return (
              <ul key={index}>
                {item.map((list_item, list_index) => (
                  <li key={list_index}>{list_item}</li>
                ))}
              </ul>
            );
          } else if (item.hasOwnProperty('code')) {
            return (
              <pre key={index}>
                <code>{item.code}</code>
              </pre>
            );
          } else {
            // Handle other object types as needed
            return <p key={index}>{JSON.stringify(item)}</p>;
          }
        }
      })}
    </div>
  );
}

export default Gemini;

