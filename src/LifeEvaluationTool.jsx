import React, { useEffect, useState } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { formatTime } from './utils/formatTime';
import { generateExportText } from './utils/generateExportText';
import { AlarmClock } from 'lucide-react';
import Timer from './components/Timer';
import Tabs from './components/Tabs';
import GoalsList from './components/GoalsList';
import LifeAreasGrid from './components/LifeAreasGrid';
import SummaryPanel from './components/SummaryPanel';
import DayThoughtsPanel from './components/DayThoughtsPanel';
import EveningGoalsInput from './components/EveningGoalsInput';
import PhoneUsageInput from './components/PhoneUsageInput';
import DailyRoutineInput from './components/DailyRoutineInput';
import DistractionTracker from './components/DistractionTracker';
import DistractionInsights from './components/DistractionInsights';

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

const defaultMorningResponses = lifeAreas.reduce((acc, area) => ({ ...acc, [area]: { feeling: '', notes: '' } }), {});
const defaultEveningResponses = { goal1: '', goal2: '', goal3: '', dayThoughts: '', firstHour: '', phoneUsage: '' };
const defaultGoals = { goal1: { text: '', completed: false }, goal2: { text: '', completed: false }, goal3: { text: '', completed: false } };
const defaultDailyRoutines = Array(5).fill(null).map(() => ({ text: '', completed: false }));

export default function LifeEvaluationTool() {
  const [activeTab, setActiveTab] = usePersistentState('activeTab', 'morning');
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = usePersistentState('isComplete', false);
  const [eveningDone, setEveningDone] = usePersistentState('eveningDone', false);
  const [hasUsedExtraTime, setHasUsedExtraTime] = useState(false);
  const [morningResponses, setMorningResponses] = usePersistentState('morningResponses', defaultMorningResponses);
  const [eveningResponses, setEveningResponses] = usePersistentState('eveningResponses', defaultEveningResponses);
  const [todaysGoals, setTodaysGoals] = usePersistentState('todaysGoals', defaultGoals);
  const [yesterdaysGoals, setYesterdaysGoals] = usePersistentState('yesterdaysGoals', defaultGoals);
  const [yesterdaysDayThoughts, setYesterdaysDayThoughts] = usePersistentState('yesterdaysDayThoughts', '');
  const [yesterdaysPhoneUsage, setYesterdaysPhoneUsage] = usePersistentState('yesterdaysPhoneUsage', '');
  const [dailyRoutines, setDailyRoutines] = usePersistentState('dailyRoutines', defaultDailyRoutines);
  const [yesterdaysRoutines, setYesterdaysRoutines] = usePersistentState('yesterdaysRoutines', defaultDailyRoutines);
  const [distractions, setDistractions] = usePersistentState('distractions', []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
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

  function markEveningDone() {
    setYesterdaysDayThoughts(eveningResponses.dayThoughts);
    setYesterdaysPhoneUsage(eveningResponses.phoneUsage);
    setYesterdaysRoutines(dailyRoutines.map(routine => ({ ...routine, completed: false })));
    setEveningDone(true);
    setIsComplete(true);
  }

  function handleStart() { setIsRunning(true); }
  function handlePause() { setIsRunning(false); }
  function handleReset() {
    try {
      setIsRunning(false);
      setTimeLeft(120);
      setIsComplete(false);
      setHasUsedExtraTime(false);
      if (activeTab === 'morning') {
        setMorningResponses(defaultMorningResponses);
        setTodaysGoals(prev => ({
          goal1: { text: prev.goal1.text, completed: false },
          goal2: { text: prev.goal2.text, completed: false },
          goal3: { text: prev.goal3.text, completed: false }
        }));
      } else {
        setYesterdaysGoals({ ...todaysGoals });
        setYesterdaysDayThoughts(eveningResponses.dayThoughts);
        setTodaysGoals(defaultGoals);
        setEveningResponses(defaultEveningResponses);
        setEveningDone(false);
      }
    } catch (error) {
      setIsRunning(false);
      setTimeLeft(120);
      setIsComplete(false);
      setHasUsedExtraTime(false);
      if (activeTab === 'evening') setEveningDone(false);
    }
  }
  function handleTabChange(tab) {
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
  }
  function handleEveningGoalChange(goalNumber, value) {
    if (eveningDone) return;
    setEveningResponses(prev => ({ ...prev, [`goal${goalNumber}`]: value }));
    setTodaysGoals(prev => ({
      ...prev, [`goal${goalNumber}`]: { text: value, completed: prev[`goal${goalNumber}`].completed }
    }));
  }
  function handleFirstHourChange(value) {
    if (eveningDone) return;
    setEveningResponses(prev => ({ ...prev, firstHour: value }));
  }
  function handleEveningThoughtsChange(value) {
    if (eveningDone) return;
    setEveningResponses(prev => ({ ...prev, dayThoughts: value }));
  }
  function handlePhoneUsageChange(value) {
    if (eveningDone) return;
    setEveningResponses(prev => ({ ...prev, phoneUsage: value }));
  }
  function handleDailyRoutineChange(newRoutines) {
    if (eveningDone) return;
    setDailyRoutines(newRoutines);
  }
  function handleYesterdaysRoutineToggle(index) {
    setYesterdaysRoutines(prev => {
      const newRoutines = [...prev];
      newRoutines[index] = { ...newRoutines[index], completed: !newRoutines[index].completed };
      return newRoutines;
    });
  }
  function handleAddDistraction(distraction) {
    setDistractions(prev => [...prev, distraction]);
  }
  function handleRemoveDistraction(id) {
    setDistractions(prev => prev.filter(d => d.id !== id));
  }
  function handleClearAllDistractions() {
    if (window.confirm('Are you sure you want to clear all distractions? This cannot be undone.')) {
      setDistractions([]);
    }
  }
  function handleGoalToggle(goalNumber) {
    setTodaysGoals(prev => ({
      ...prev, [`goal${goalNumber}`]: { ...prev[`goal${goalNumber}`], completed: !prev[`goal${goalNumber}`].completed }
    }));
  }
  function getMorningCompletionCount() {
    return Object.values(morningResponses).filter(r => r.feeling !== '').length;
  }
  function getEveningCompletionCount() {
    const goalCount = [
      eveningResponses?.goal1 || '', 
      eveningResponses?.goal2 || '', 
      eveningResponses?.goal3 || ''
    ].filter(goal => goal.trim() !== '').length;
    const thoughtsCount = (eveningResponses?.dayThoughts || '').trim() !== '' ? 1 : 0;
    // Phone usage is valid if it's not empty and not "0m" (which means no time selected)
    const phoneUsage = (eveningResponses?.phoneUsage || '').trim();
    const phoneCount = phoneUsage !== '' && phoneUsage !== '0m' ? 1 : 0;
    return goalCount + thoughtsCount + phoneCount;
  }
  function copyToClipboard(isEvening = false) {
    const exportText = generateExportText({
      isEvening,
      eveningResponses,
      yesterdaysGoals,
      yesterdaysDayThoughts,
      yesterdaysPhoneUsage,
      yesterdaysRoutines,
      dailyRoutines,
      distractions,
      todaysGoals,
      lifeAreas,
      morningResponses,
      feelingOptions
    });
    if (isEvening) markEveningDone();
    try {
      navigator.clipboard.writeText(exportText);
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
  }

  // UI
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Floating Timer */}
      <div className="fixed top-4 right-4 bg-white border-2 border-gray-300 rounded-full p-3 shadow-lg z-50">
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-gray-800'}`}>{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Check-In</h1>
        <p className="text-gray-600">Track your feelings and set intentions</p>
      </div>
      <Tabs activeTab={activeTab} setActiveTab={handleTabChange} eveningDone={eveningDone} distractionCount={distractions.length} />
      <Timer
        timeLeft={timeLeft} // pass the raw number
        isRunning={isRunning}
        isComplete={isComplete}
        eveningDone={eveningDone}
        activeTab={activeTab}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onMarkEveningDone={markEveningDone}
        canResume={!isRunning && timeLeft < 120 && !eveningDone}
        canMarkDone={activeTab === 'evening' && !eveningDone && getEveningCompletionCount() === 5}
      />
      <div className="text-sm text-gray-600 mb-8">
        {activeTab === 'morning' ? (
          <>Progress: {getMorningCompletionCount()}/{lifeAreas.length} areas evaluated</>
        ) : (
          <>Progress: {getEveningCompletionCount()}/5 items completed {eveningDone && <span className="text-green-600 font-semibold">✓ Locked</span>}</>
        )}
      </div>
      {/* Morning Tab Content */}
      {activeTab === 'morning' && (
        <>
          {/* Yesterday's Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📅 Yesterday's Review
            </h2>
            <GoalsList goals={yesterdaysGoals} editable={false} title="Yesterday's Goals" colorClass="bg-gray-50" />
            {yesterdaysDayThoughts.trim() !== '' && (
              <DayThoughtsPanel value={yesterdaysDayThoughts} editable={false} label="Yesterday's Day Thoughts" colorClass="bg-gray-50" />
            )}
            {yesterdaysPhoneUsage.trim() !== '' && (
              <PhoneUsageInput value={yesterdaysPhoneUsage} editable={false} label="Yesterday's Phone Usage" colorClass="bg-gray-50" />
            )}
            <DailyRoutineInput
              routines={yesterdaysRoutines}
              onRoutineToggle={handleYesterdaysRoutineToggle}
              editable={false}
              showCheckboxes={true}
              title="Yesterday's Daily Routines"
              colorClass="bg-gray-50"
            />
          </div>

          {/* Today's Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              🌟 Today's Focus
            </h2>
            {/* First Hour Activity Display */}
            {eveningResponses.firstHour && eveningResponses.firstHour.trim() && (
              <div className="mb-6 p-4 border-2 border-blue-500 bg-blue-50 rounded flex items-center gap-4">
                <AlarmClock className="w-6 h-6 text-blue-600" />
                <div className="flex-1">
                  <label className="block text-base font-semibold text-blue-800 mb-1">First Hour Activity/Task</label>
                  <div className="p-3 border border-blue-300 rounded-lg text-base bg-white">
                    {eveningResponses.firstHour}
                  </div>
                </div>
              </div>
            )}
            <GoalsList goals={todaysGoals} onToggle={handleGoalToggle} editable={true} title="Today's Goals" colorClass="bg-blue-50" />
          </div>
          <LifeAreasGrid
            lifeAreas={lifeAreas}
            morningResponses={morningResponses}
            setMorningResponses={setMorningResponses}
            feelingOptions={feelingOptions}
            editable={true}
          />
          {getMorningCompletionCount() > 0 && (
            <SummaryPanel
              title="Morning Summary"
              exportText={generateExportText({
                isEvening: false,
                eveningResponses,
                yesterdaysGoals,
                yesterdaysDayThoughts,
                yesterdaysPhoneUsage,
                yesterdaysRoutines,
                dailyRoutines,
                distractions,
                todaysGoals,
                lifeAreas,
                morningResponses,
                feelingOptions
              })}
              onCopy={() => copyToClipboard(false)}
              googleDocsUrl="https://docs.google.com/document/u/0/"
              previewLabel="Preview:"
            />
          )}
        </>
      )}
      {/* Evening Tab Content */}
      {activeTab === 'evening' && (
        <>
          {eveningDone && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-green-800 font-medium">Evening reflection completed and locked. Use Reset to unlock and edit.</span>
              </div>
            </div>
          )}
          <PhoneUsageInput
            value={eveningResponses.phoneUsage}
            onChange={handlePhoneUsageChange}
            editable={!eveningDone}
            label="Phone Usage Time"
            colorClass="bg-red-50"
          />
          <EveningGoalsInput
            eveningResponses={eveningResponses}
            onGoalChange={handleEveningGoalChange}
            onFirstHourChange={handleFirstHourChange}
            editable={!eveningDone}
          />
          <DayThoughtsPanel
            value={eveningResponses.dayThoughts}
            onChange={handleEveningThoughtsChange}
            editable={!eveningDone}
            label="Day Thoughts"
            colorClass="bg-white"
            placeholder="Reflect on your day... wins, challenges, insights, or anything on your mind"
          />
          <DailyRoutineInput
            routines={dailyRoutines}
            onRoutineChange={handleDailyRoutineChange}
            editable={!eveningDone}
            title="Daily Routines Setup"
            colorClass="bg-purple-50"
          />
          <DistractionInsights
            distractions={distractions}
            title="Today's Focus & Distraction Reflection"
            showFullDetails={true}
            colorTheme="purple"
          />
          {getEveningCompletionCount() > 0 && (
            <SummaryPanel
              title="Evening Summary"
              exportText={generateExportText({
                isEvening: true,
                eveningResponses,
                yesterdaysGoals,
                yesterdaysDayThoughts,
                yesterdaysPhoneUsage,
                yesterdaysRoutines,
                dailyRoutines,
                distractions,
                todaysGoals,
                lifeAreas,
                morningResponses,
                feelingOptions
              })}
              onCopy={() => copyToClipboard(true)}
              googleDocsUrl="https://docs.google.com/document/u/0/"
              previewLabel="Preview:"
            />
          )}
        </>
      )}
      {/* Distractions Tab Content */}
      {activeTab === 'distractions' && (
        <DistractionTracker
          distractions={distractions}
          onAddDistraction={handleAddDistraction}
          onRemoveDistraction={handleRemoveDistraction}
          onClearAll={handleClearAllDistractions}
        />
      )}
      {/* Reset All Data Button */}
      <button
        className="mt-8 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        onClick={() => {
          if (window.confirm("Are you sure you want to reset all saved data? This cannot be undone.")) {
            [
              'activeTab',
              'isComplete',
              'eveningDone',
              'morningResponses',
              'eveningResponses',
              'todaysGoals',
              'yesterdaysGoals',
              'yesterdaysDayThoughts',
              'yesterdaysPhoneUsage',
              'dailyRoutines',
              'yesterdaysRoutines',
              'distractions'
            ].forEach(key => localStorage.removeItem(key));
            window.location.reload();
          }
        }}
      >
        Reset All Data
      </button>
    </div>
  );
}