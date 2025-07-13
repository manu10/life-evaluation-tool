import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckCircle, ExternalLink, Sun, Moon, Check } from 'lucide-react';

const LifeEvaluationTool = () => {
  const [activeTab, setActiveTab] = useState('morning');
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [eveningDone, setEveningDone] = useState(false);
  const [hasUsedExtraTime, setHasUsedExtraTime] = useState(false);
  
  const lifeAreas = [
    'Health & Energy', 'Relationships', 'Work & Career', 'Personal Growth',
    'Fun & Recreation', 'Finances', 'Living Environment'
  ];

  const feelingOptions = [
    { value: 'thriving', label: 'Thriving 🌟', color: 'bg-green-500' },
    { value: 'good', label: 'Good 😊', color: 'bg-blue-500' },
    { value: 'okay', label: 'Okay 😐', color: 'bg-yellow-500' },
    { value: 'struggling', label: 'Struggling 😔', color: 'bg-orange-500' },
    { value: 'stuck', label: 'Stuck 😰', color: 'bg-red-500' }
  ];

  const [morningResponses, setMorningResponses] = useState(
    lifeAreas.reduce((acc, area) => ({ ...acc, [area]: { feeling: '', notes: '' } }), {})
  );

  const [eveningResponses, setEveningResponses] = useState({
    goal1: '', goal2: '', goal3: '', dayThoughts: ''
  });

  const [todaysGoals, setTodaysGoals] = useState({
    goal1: { text: '', completed: false },
    goal2: { text: '', completed: false },
    goal3: { text: '', completed: false }
  });

  const [yesterdaysGoals, setYesterdaysGoals] = useState({
    goal1: { text: '', completed: false },
    goal2: { text: '', completed: false },
    goal3: { text: '', completed: false }
  });

  const [yesterdaysDayThoughts, setYesterdaysDayThoughts] = useState('');

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeTab === 'evening' && !eveningDone && !hasUsedExtraTime) {
      setIsRunning(false);
      setIsComplete(true);
      const addTime = window.confirm("Time's up! Would you like 1 extra minute to finish?");
      if (addTime) {
        setTimeLeft(60);
        setHasUsedExtraTime(true);
        setIsComplete(false);
        setIsRunning(true);
      } else {
        markEveningDone();
      }
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsComplete(true);
      if (activeTab === 'evening' && !eveningDone) {
        markEveningDone();
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeTab, eveningDone, hasUsedExtraTime]);

  const markEveningDone = () => {
    setEveningDone(true);
    setIsComplete(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    try {
      // Reset common states
      setIsRunning(false);
      setTimeLeft(120);
      setIsComplete(false);
      setHasUsedExtraTime(false);
      
      if (activeTab === 'morning') {
        // Reset morning responses
        setMorningResponses(lifeAreas.reduce((acc, area) => ({
          ...acc, [area]: { feeling: '', notes: '' }
        }), {}));
        
        // Reset today's goal completions but keep text
        setTodaysGoals(prev => ({
          goal1: { text: prev.goal1.text, completed: false },
          goal2: { text: prev.goal2.text, completed: false },
          goal3: { text: prev.goal3.text, completed: false }
        }));
      } else {
        // Evening reset: move today's goals to yesterday
        setYesterdaysGoals({ ...todaysGoals });
        setYesterdaysDayThoughts(eveningResponses.dayThoughts);
        
        // Clear today's goals
        setTodaysGoals({ 
          goal1: { text: '', completed: false }, 
          goal2: { text: '', completed: false }, 
          goal3: { text: '', completed: false } 
        });
        
        // Clear evening responses
        setEveningResponses({ 
          goal1: '', 
          goal2: '', 
          goal3: '', 
          dayThoughts: '' 
        });
        
        // Unlock evening
        setEveningDone(false);
      }
    } catch (error) {
      console.error('Reset error:', error);
      // Fallback reset
      setIsRunning(false);
      setTimeLeft(120);
      setIsComplete(false);
      setHasUsedExtraTime(false);
      if (activeTab === 'evening') {
        setEveningDone(false);
      }
    }
  };

  const handleTabChange = (tab) => {
    if (tab === 'morning' && activeTab === 'evening' && !eveningDone && getEveningCompletionCount() > 0) {
      const confirm = window.confirm(
        "Switching to morning will mark your evening reflection as done and lock it until reset. Continue?"
      );
      if (confirm) {
        markEveningDone();
        setActiveTab(tab);
      }
    } else {
      setActiveTab(tab);
    }
    setIsRunning(false);
  };

  const handleEveningGoalChange = (goalNumber, value) => {
    if (eveningDone) return;
    setEveningResponses(prev => ({ ...prev, [`goal${goalNumber}`]: value }));
    setTodaysGoals(prev => ({
      ...prev, [`goal${goalNumber}`]: { text: value, completed: prev[`goal${goalNumber}`].completed }
    }));
  };

  const handleEveningThoughtsChange = (value) => {
    if (eveningDone) return;
    setEveningResponses(prev => ({ ...prev, dayThoughts: value }));
  };

  const handleGoalToggle = (goalNumber) => {
    setTodaysGoals(prev => ({
      ...prev, [`goal${goalNumber}`]: { ...prev[`goal${goalNumber}`], completed: !prev[`goal${goalNumber}`].completed }
    }));
  };

  const getMorningCompletionCount = () => Object.values(morningResponses).filter(r => r.feeling !== '').length;

  const getEveningCompletionCount = () => {
    const goalCount = [eveningResponses.goal1, eveningResponses.goal2, eveningResponses.goal3]
      .filter(goal => goal.trim() !== '').length;
    const thoughtsCount = eveningResponses.dayThoughts.trim() !== '' ? 1 : 0;
    return goalCount + thoughtsCount;
  };

  const generateExportText = (isEvening = false) => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    let exportText = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    exportText += `${isEvening ? '🌙 EVENING REFLECTION' : '🌅 MORNING CHECK-IN'} - ${dateStr}\n`;
    exportText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (isEvening) {
      exportText += `🎯 Tomorrow's Goals:\n`;
      [eveningResponses.goal1, eveningResponses.goal2, eveningResponses.goal3].forEach((goal, index) => {
        if (goal.trim()) exportText += `   ${index + 1}. ${goal}\n`;
      });
      exportText += `\n`;

      if (eveningResponses.dayThoughts.trim()) {
        exportText += `💭 Day Thoughts:\n${eveningResponses.dayThoughts}\n\n`;
      }
    } else {
      // Yesterday's goals if available
      const hasYesterdayGoals = Object.values(yesterdaysGoals).some(goal => goal.text.trim() !== '');
      if (hasYesterdayGoals) {
        exportText += `📋 Yesterday's Goals:\n`;
        Object.entries(yesterdaysGoals).forEach(([key, goal]) => {
          if (goal.text.trim()) {
            const status = goal.completed ? '✅' : '❌';
            exportText += `   ${status} ${goal.text}\n`;
          }
        });
        exportText += `\n`;
      }

      // Yesterday's day thoughts if available
      if (yesterdaysDayThoughts.trim()) {
        exportText += `💭 Yesterday's Day Thoughts:\n${yesterdaysDayThoughts}\n\n`;
      }

      // Today's goals
      const hasTodayGoals = Object.values(todaysGoals).some(goal => goal.text.trim() !== '');
      if (hasTodayGoals) {
        exportText += `📋 Today's Goals:\n`;
        Object.entries(todaysGoals).forEach(([key, goal]) => {
          if (goal.text.trim()) {
            const status = goal.completed ? '✅' : '⏳';
            exportText += `   ${status} ${goal.text}\n`;
          }
        });
        exportText += `\n`;
      }

      exportText += `🎯 Life Areas:\n`;
      lifeAreas.forEach((area) => {
        const response = morningResponses[area];
        if (response.feeling) {
          const selectedFeeling = feelingOptions.find(opt => opt.value === response.feeling);
          exportText += `🔸 ${area}: ${selectedFeeling.label}\n`;
          if (response.notes.trim()) exportText += `   💭 ${response.notes}\n`;
          exportText += `\n`;
        }
      });
    }

    exportText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    return exportText;
  };

  const copyToClipboard = async () => {
    const exportText = generateExportText(activeTab === 'evening');
    if (activeTab === 'evening') markEveningDone();
    
    try {
      await navigator.clipboard.writeText(exportText);
      alert('✅ Summary copied to clipboard! Ready to paste into your Google Doc.');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = exportText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Summary copied to clipboard! Ready to paste into your Google Doc.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Floating Timer */}
      <div className="fixed top-4 right-4 bg-white border-2 border-gray-300 rounded-full p-3 shadow-lg z-50">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className={`text-lg font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-gray-800'}`}>
            {formatTime(timeLeft)}
          </span>
          {(isComplete || eveningDone) && <CheckCircle className="w-5 h-5 text-green-600" />}
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Check-In</h1>
        <p className="text-gray-600">Track your feelings and set intentions</p>
      </div>

      {/* Tabs */}
      <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleTabChange('morning')}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
            activeTab === 'morning' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Sun className="w-5 h-5" />
          Morning Check-In
        </button>
        <button
          onClick={() => handleTabChange('evening')}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
            activeTab === 'evening' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Moon className="w-5 h-5" />
          Evening Reflection
          {eveningDone && <CheckCircle className="w-4 h-4 text-green-600" />}
        </button>
      </div>

      {/* Timer Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-800">{formatTime(timeLeft)}</span>
            {(isComplete || eveningDone) && <CheckCircle className="w-6 h-6 text-green-600" />}
          </div>
          <div className="flex gap-2">
            {!isRunning && timeLeft === 120 && (
              <button onClick={handleStart} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Play className="w-4 h-4" />Start
              </button>
            )}
            {isRunning && (
              <button onClick={handlePause} className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                <Pause className="w-4 h-4" />Pause
              </button>
            )}
            {!isRunning && timeLeft < 120 && !eveningDone && (
              <button onClick={handleStart} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Play className="w-4 h-4" />Resume
              </button>
            )}
            {activeTab === 'evening' && !eveningDone && getEveningCompletionCount() > 0 && (
              <button onClick={markEveningDone} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Check className="w-4 h-4" />Done
              </button>
            )}
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <RotateCcw className="w-4 h-4" />Reset
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {activeTab === 'morning' ? (
            <>Progress: {getMorningCompletionCount()}/{lifeAreas.length} areas evaluated</>
          ) : (
            <>Progress: {getEveningCompletionCount()}/4 items completed {eveningDone && <span className="text-green-600 font-semibold">✓ Locked</span>}</>
          )}
        </div>
      </div>

      {/* Morning Tab Content */}
      {activeTab === 'morning' && (
        <>
          {/* Yesterday's Goals */}
          {Object.values(yesterdaysGoals).some(goal => goal.text.trim() !== '') && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Yesterday's Goals</h3>
              <div className="space-y-3">
                {Object.entries(yesterdaysGoals).map(([key, goal]) => {
                  if (!goal.text.trim()) return null;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${goal.completed ? 'bg-green-500' : 'bg-red-500'}`}>
                        <span className="text-white text-xs">{goal.completed ? '✓' : '✗'}</span>
                      </div>
                      <span className={`text-gray-800 ${goal.completed ? 'text-green-700' : 'text-red-700'}`}>
                        {goal.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Yesterday's Day Thoughts */}
          {yesterdaysDayThoughts.trim() !== '' && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💭 Yesterday's Day Thoughts</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{yesterdaysDayThoughts}</p>
              </div>
            </div>
          )}

          {/* Today's Goals */}
          {Object.values(todaysGoals).some(goal => goal.text.trim() !== '') && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Today's Goals</h3>
              <div className="space-y-3">
                {Object.entries(todaysGoals).map(([key, goal]) => {
                  if (!goal.text.trim()) return null;
                  const goalNumber = key.replace('goal', '');
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => handleGoalToggle(goalNumber)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`text-gray-800 ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                        {goal.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Life Areas Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {lifeAreas.map((area) => (
              <div key={area} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{area}</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">How do you feel about this area?</label>
                  <div className="flex flex-wrap gap-2">
                    {feelingOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setMorningResponses(prev => ({
                          ...prev, [area]: { ...prev[area], feeling: option.value }
                        }))}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          morningResponses[area].feeling === option.value
                            ? `${option.color} text-white shadow-md`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick thoughts (optional)</label>
                  <textarea
                    value={morningResponses[area].notes}
                    onChange={(e) => setMorningResponses(prev => ({
                      ...prev, [area]: { ...prev[area], notes: e.target.value }
                    }))}
                    placeholder="What's on your mind about this area?"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>

          {getMorningCompletionCount() > 0 && (
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Morning Summary</h3>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    📋 Copy for Google Doc
                  </button>
                  <a href="https://docs.google.com/document/u/0/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ExternalLink className="w-4 h-4" />Open Google Docs
                  </a>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto">
                  {generateExportText(false)}
                </pre>
              </div>
            </div>
          )}
        </>
      )}

      {/* Evening Tab Content */}
      {activeTab === 'evening' && (
        <>
          {eveningDone && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Evening reflection completed and locked. Use Reset to unlock and edit.</span>
              </div>
            </div>
          )}

          <div className="bg-purple-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Tomorrow's 3 Main Goals</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((num) => (
                <div key={num}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal {num}</label>
                  <input
                    type="text"
                    value={eveningResponses[`goal${num}`]}
                    onChange={(e) => handleEveningGoalChange(num, e.target.value)}
                    disabled={eveningDone}
                    placeholder="What's one important thing you want to accomplish tomorrow?"
                    className={`w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      eveningDone ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💭 Day Thoughts</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How did today go? What are you thinking about?</label>
              <textarea
                value={eveningResponses.dayThoughts}
                onChange={(e) => handleEveningThoughtsChange(e.target.value)}
                disabled={eveningDone}
                placeholder="Reflect on your day... wins, challenges, insights, or anything on your mind"
                className={`w-full p-3 border border-gray-300 rounded-lg resize-none h-32 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  eveningDone ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {getEveningCompletionCount() > 0 && (
            <div className="mt-8 bg-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Evening Summary</h3>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    📋 Copy for Google Doc
                  </button>
                  <a href="https://docs.google.com/document/u/0/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ExternalLink className="w-4 h-4" />Open Google Docs
                  </a>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto">
                  {generateExportText(true)}
                </pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LifeEvaluationTool;