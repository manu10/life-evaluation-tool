import React from 'react';

// Collection of nurturing gratitude phrases that rotate daily
const gratitudePhrases = [
  "Take a moment to notice the good already present in your life",
  "What small miracles happened around you today?",
  "Pause and appreciate the gifts that often go unnoticed",
  "Look for the silver linings woven into your day",
  "What made your heart feel lighter recently?",
  "Notice the people who brought warmth to your world",
  "Celebrate the simple pleasures that sparked joy",
  "Reflect on moments when you felt truly supported",
  "What experiences filled you with wonder today?",
  "Appreciate the progress you've made, no matter how small",
  "Honor the challenges that helped you grow stronger",
  "What acts of kindness touched your heart?",
  "Find gratitude in the ordinary moments that felt extraordinary",
  "Acknowledge the resources and opportunities around you",
  "What brought a smile to your face when you needed it most?",
  "Notice the beauty that caught your attention today",
  "Appreciate your body for carrying you through each day",
  "What conversations or connections enriched your life?",
  "Find thankfulness in the lessons disguised as difficulties",
  "Celebrate the comfort and security you have access to",
  "What creative expressions or ideas inspired you?",
  "Notice the ways life surprised you with unexpected gifts",
  "Appreciate the quiet moments that brought you peace",
  "What skills or abilities served you well today?",
  "Find gratitude in the love you both gave and received",
  "Notice the progress happening in areas you're working on",
  "What natural elements reminded you of life's abundance?",
  "Appreciate the technology and conveniences that ease your day",
  "What memories brought warmth to your heart?",
  "Honor your resilience in navigating life's ups and downs"
];

// Get a consistent daily phrase based on the current date
function getDailyGratitudePhrase() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  return gratitudePhrases[dayOfYear % gratitudePhrases.length];
}

export default function GratitudeInput({ gratitude, onGratitudeChange, editable = true }) {
  const handleChange = (itemNumber, value) => {
    if (!editable) return;
    onGratitudeChange({ ...gratitude, [`item${itemNumber}`]: value });
  };

  const dailyPhrase = getDailyGratitudePhrase();

  return (
    <div className="bg-yellow-50 border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">🙏 Three Things I'm Grateful For</h3>
      <p className="text-sm text-gray-600 mb-4 italic">
        {dailyPhrase}
      </p>
      <div className="space-y-4">
        {[1, 2, 3].map((num) => (
          <div key={num}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gratitude {num}
            </label>
            <input
              type="text"
              value={gratitude[`item${num}`] || ''}
              onChange={(e) => handleChange(num, e.target.value)}
              disabled={!editable}
              placeholder="Something you're thankful for today..."
              className={`w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                !editable ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}