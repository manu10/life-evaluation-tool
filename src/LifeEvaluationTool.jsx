import React, { useEffect, useRef, useState } from 'react';
import { usePersistentState } from './hooks/usePersistentState';
import { formatTime } from './utils/formatTime';
import { generateExportText } from './utils/generateExportText';
import { AlarmClock } from 'lucide-react';
import Timer from './components/Timer';
import FloatingToolbar from './components/FloatingToolbar';
import Tabs from './components/Tabs';
import GoalsList from './components/GoalsList';
import LifeAreasGrid from './components/LifeAreasGrid';
import LifeAreasReflection from './components/LifeAreasReflection';
import InvestTab from './components/InvestTab';
import SummaryPanel from './components/SummaryPanel';
import DayThoughtsPanel from './components/DayThoughtsPanel';
import EveningGoalsInput from './components/EveningGoalsInput';
import EveningGoalsWithProjects from './components/EveningGoalsWithProjects';
import PhoneUsageInput from './components/PhoneUsageInput';
import DailyRoutineInput from './components/DailyRoutineInput';
import DistractionTracker from './components/DistractionTracker';
import DistractionInsights from './components/DistractionInsights';
import CollapsibleSection from './components/CollapsibleSection';
import Settings from './components/Settings';
import GratitudeInput from './components/GratitudeInput';
import MindfulnessToolkit from './components/MindfulnessToolkit';
import ABCLogger from './components/ABCLogger';
import ABCHighlights from './components/ABCHighlights';
import ReplacementActions from './components/ReplacementActions';
import ReplacementAttempt from './components/ReplacementAttempt';
import EnvironmentDesigner from './components/EnvironmentDesigner';
import EnvironmentChecklist from './components/EnvironmentChecklist';
import FiveStepProtocol from './components/FiveStepProtocol';
import WhatWorkedToday from './components/WhatWorkedToday';
import HelpModal from './components/HelpModal';
import EveningResetConfirm from './components/EveningResetConfirm';
import TodayActionHub from './components/TodayActionHub';
import AnchorNudgeBar from './components/AnchorNudgeBar';
import TodosList from './components/TodosList';
import SessionStarterModal from './components/modals/SessionStarterModal';
import SessionEnderModal from './components/modals/SessionEnderModal';
import SessionsDashboard from './components/SessionsDashboard';
import ProjectsTab from './components/ProjectsTab';
import { useProjectsStore } from './hooks/useProjectsStore';
import ProjectDetailModal from './components/modals/ProjectDetailModal';
import ProjectsSummary from './components/ProjectsSummary';

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
const defaultEveningResponses = { goal1: '', goal2: '', goal3: '', dayThoughts: '', firstHour: '', phoneUsage: '', onePercentPlan: '', onePercentLink: '' };
const defaultGoals = { goal1: { text: '', completed: false }, goal2: { text: '', completed: false }, goal3: { text: '', completed: false } };
const defaultDailyRoutines = Array(5).fill(null).map(() => ({ text: '', completed: false }));
const defaultGratitude = { item1: '', item2: '', item3: '' };

export default function LifeEvaluationTool() {
  const [activeTab, setActiveTab] = usePersistentState('activeTab', 'today');
  const [timeLeft, setTimeLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = usePersistentState('isComplete', false);
  const [eveningDone, setEveningDone] = usePersistentState('eveningDone', false);
  const [hasUsedExtraTime, setHasUsedExtraTime] = useState(false);
  const [morningCopied, setMorningCopied] = usePersistentState('morningCopied', false);
  const [morningResponses, setMorningResponses] = usePersistentState('morningResponses', defaultMorningResponses);
  const [areasReflections, setAreasReflections] = usePersistentState('areasReflections', {});
  const [eveningResponses, setEveningResponses] = usePersistentState('eveningResponses', defaultEveningResponses);
  const [todaysGoals, setTodaysGoals] = usePersistentState('todaysGoals', defaultGoals);
  const [yesterdaysGoals, setYesterdaysGoals] = usePersistentState('yesterdaysGoals', defaultGoals);
  const [todaysTodos, setTodaysTodos] = usePersistentState('todaysTodos', []);
  const [yesterdaysTodos, setYesterdaysTodos] = usePersistentState('yesterdaysTodos', []);
  const [appUsageByDate, setAppUsageByDate] = usePersistentState('appUsageByDate', {});
  const activeStartRef = useRef(null);
  const [yesterdaysDayThoughts, setYesterdaysDayThoughts] = usePersistentState('yesterdaysDayThoughts', '');
  const [yesterdaysPhoneUsage, setYesterdaysPhoneUsage] = usePersistentState('yesterdaysPhoneUsage', '');
  const [dailyRoutines, setDailyRoutines] = usePersistentState('dailyRoutines', defaultDailyRoutines);
  const [yesterdaysRoutines, setYesterdaysRoutines] = usePersistentState('yesterdaysRoutines', defaultDailyRoutines);
  const [distractions, setDistractions] = usePersistentState('distractions', []);
  const [yesterdaysDistractions, setYesterdaysDistractions] = usePersistentState('yesterdaysDistractions', []);
  const [gratitude, setGratitude] = usePersistentState('gratitude', defaultGratitude);
  const [yesterdaysGratitude, setYesterdaysGratitude] = usePersistentState('yesterdaysGratitude', defaultGratitude);
  const [onePercentDone, setOnePercentDone] = usePersistentState('onePercentDone', false);
  const [yesterdaysOnePercentPlan, setYesterdaysOnePercentPlan] = usePersistentState('yesterdaysOnePercentPlan', '');
  const [yesterdaysOnePercentDone, setYesterdaysOnePercentDone] = usePersistentState('yesterdaysOnePercentDone', false);
  // Mindfulness & ABC (M1)
  const [mindfulnessSettings, setMindfulnessSettings] = usePersistentState('mindfulnessSettings', {
    enablePrompts: true,
    anchorSec: 30,
    pauseSec: 90,
    enableFiveStep: true,
    anchorFrequency: 'off'
  });
  const [microPracticeLogs, setMicroPracticeLogs] = usePersistentState('microPracticeLogs', []);
  const [abcLogs, setAbcLogs] = usePersistentState('abcLogs', []);
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const [isABCOpen, setIsABCOpen] = useState(false);
  const [abcInitial, setAbcInitial] = useState({});
  const [replacementActions, setReplacementActions] = usePersistentState('replacementActions', []);
  const [attemptAction, setAttemptAction] = useState(null);
  const [environmentProfile, setEnvironmentProfile] = usePersistentState('environmentProfile', { removals: [], additions: [] });
  const [environmentApplications, setEnvironmentApplications] = usePersistentState('environmentApplications', []);
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [replacementAttempts, setReplacementAttempts] = usePersistentState('replacementAttempts', []);
  const [anxietyRatings, setAnxietyRatings] = usePersistentState('anxietyRatings', []);
  const [weeklyAdjustments, setWeeklyAdjustments] = usePersistentState('weeklyAdjustments', []);
  const [missedAdjustments, setMissedAdjustments] = usePersistentState('missedAdjustments', []);
  const [linkedDistractionId, setLinkedDistractionId] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isStartSessionOpen, setIsStartSessionOpen] = useState(false);
  const [isEndSessionOpen, setIsEndSessionOpen] = useState(false);
  const [hooks, setHooks] = usePersistentState('hooks', []);
  const [sessions, setSessions] = usePersistentState('sessions', []);
  const [liveSession, setLiveSession] = useState(null);

  // Invest: Opportunities, Sprints, Decisions, Reading usage
  const [investOpportunities, setInvestOpportunities] = usePersistentState('investOpportunities', []);
  const [investSprints, setInvestSprints] = usePersistentState('investSprints', []);
  const [investDecisions, setInvestDecisions] = usePersistentState('investDecisions', []);
  const [investReadingUsageByDate, setInvestReadingUsageByDate] = usePersistentState('investReadingUsageByDate', {});
  // App feature flags
  const [featureFlags, setFeatureFlags] = usePersistentState('featureFlags', { 
    projectsTab: true, 
    investTab: true, 
    distractionsTab: false, 
    sessionsTab: false 
  });
  // Projects store
  const { projects, addProject, updateProject, removeProject, setNextAction } = useProjectsStore();
  const [openProjectId, setOpenProjectId] = useState(null);

  // Sync Areas Reflection into classic morningResponses for unified export structure
  useEffect(() => {
    if (mindfulnessSettings?.morningMode !== 'areasReflection') return;
    const mapped = lifeAreas.reduce((acc, area) => {
      const ref = areasReflections?.[area] || {};
      const parts = [];
      if (ref.grateful && String(ref.grateful).trim()) parts.push(`Grateful: ${ref.grateful}`);
      if (ref.improve && String(ref.improve).trim()) parts.push(`Improve: ${ref.improve}`);
      acc[area] = {
        feeling: ref.feeling || '',
        notes: parts.join(' | ')
      };
      return acc;
    }, {});
    setMorningResponses(mapped);
  }, [areasReflections, mindfulnessSettings?.morningMode, lifeAreas]);

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

  // App usage tracking (time while tab visible and window focused)
  useEffect(() => {
    function getDateKey(ts) {
      const d = new Date(ts);
      d.setHours(0, 0, 0, 0);
      return d.toISOString().slice(0, 10);
    }
    function startActive() {
      if (document.visibilityState === 'visible' && document.hasFocus() && activeStartRef.current == null) {
        activeStartRef.current = Date.now();
      }
    }
    function stopActive() {
      if (activeStartRef.current != null) {
        const now = Date.now();
        const deltaSec = Math.max(0, Math.floor((now - activeStartRef.current) / 1000));
        const key = getDateKey(now);
        setAppUsageByDate(prev => ({ ...prev, [key]: (prev[key] || 0) + deltaSec }));
        activeStartRef.current = null;
      }
    }
    function onVis() { if (document.visibilityState === 'visible') startActive(); else stopActive(); }
    function onFocus() { startActive(); }
    function onBlur() { stopActive(); }
    function onBeforeUnload() { stopActive(); }
    startActive();
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      stopActive();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [setAppUsageByDate]);

  function getUsageSecondsFor(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    const base = appUsageByDate?.[key] || 0;
    const todayKey = new Date().toISOString().slice(0, 10);
    if (key === todayKey && activeStartRef.current != null && document.visibilityState === 'visible' && document.hasFocus()) {
      return base + Math.max(0, Math.floor((Date.now() - activeStartRef.current) / 1000));
    }
    return base;
  }

  function formatDurationShort(totalSec) {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${s}s`;
  }

  function markEveningDone() {
    setYesterdaysDayThoughts(eveningResponses.dayThoughts);
    setYesterdaysPhoneUsage(eveningResponses.phoneUsage);
    setYesterdaysRoutines(dailyRoutines.map(routine => ({ ...routine, completed: false })));
    setYesterdaysDistractions(distractions); // Save current distractions as yesterday's
    setYesterdaysOnePercentPlan(eveningResponses.onePercentPlan || '');
    setYesterdaysOnePercentDone(!!onePercentDone);
    setEveningDone(true);
    setIsComplete(true);
  }

  function handleStart() { setIsRunning(true); }
  function handlePause() { setIsRunning(false); }
  function autoStartTimer() {
    // Auto-start timer when making changes in morning tab if not already running and timer not at 0
    if (activeTab === 'morning' && !isRunning && timeLeft > 0) {
      setIsRunning(true);
      setMorningCopied(false); // Reset copied status when making new changes
    }
  }
  function handleReset() {
    // Show confirmation dialog for evening reset
    if (activeTab === 'evening') {
      setIsResetConfirmOpen(true);
      return;
    }

    try {
      setIsRunning(false);
      setTimeLeft(120);
      setIsComplete(false);
      setHasUsedExtraTime(false);
      if (activeTab === 'morning') {
        setMorningResponses(defaultMorningResponses);
        setYesterdaysGratitude(gratitude);
        setGratitude(defaultGratitude);
        setAreasReflections({});
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
        // Reset distractions when resetting evening tab since they are daily
        setDistractions([]);
        setOnePercentDone(false);
      }
    } catch (error) {
      setIsRunning(false);
      setTimeLeft(120);
      setIsComplete(false);
      setHasUsedExtraTime(false);
      if (activeTab === 'evening') {
        setEveningDone(false);
        // Also reset distractions in error case
        setDistractions([]);
        setOnePercentDone(false);
      } else if (activeTab === 'morning') {
        setAreasReflections({});
      }
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
  function handleOnePercentPlanChange(value) {
    if (eveningDone) return;
    setEveningResponses(prev => ({ ...prev, onePercentPlan: value }));
  }
  function handleOnePercentLinkChange(value) {
    if (eveningDone) return;
    setEveningResponses(prev => ({ ...prev, onePercentLink: value }));
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
    // Link next replacement attempt to this distraction
    setLinkedDistractionId(distraction?.id ?? null);
  }
  function handleRemoveDistraction(id) {
    setDistractions(prev => prev.filter(d => d.id !== id));
  }
  function handleClearAllDistractions() {
    if (window.confirm('Are you sure you want to clear all distractions? This cannot be undone.')) {
      setDistractions([]);
    }
  }
  // Micro-practice logging
  function handleLogMicroPractice(type, source = 'manual', trigger, extra = {}) {
    const entry = { id: Date.now(), ts: Date.now(), type, source, trigger, ...extra };
    setMicroPracticeLogs(prev => [...prev, entry]);
  }
  // ABC save
  function handleSaveABC(form) {
    const entry = { id: Date.now(), ts: Date.now(), ...form };
    setAbcLogs(prev => [entry, ...prev]);
    setIsABCOpen(false);
  }
  // Environment applied
  function handleApplyEnvironment(item) {
    setEnvironmentApplications(prev => [{ id: Date.now(), ts: Date.now(), ...item }, ...prev]);
  }
  // Replacement actions CRUD
  function handleAddReplacementAction({ title, isEasy, rewardText }) {
    setReplacementActions(prev => [{ id: Date.now(), title, isEasy, rewardText }, ...prev]);
  }
  function handleRemoveReplacementAction(id) {
    setReplacementActions(prev => prev.filter(a => a.id !== id));
  }
  function handleToggleEasy(id) {
    setReplacementActions(prev => prev.map(a => a.id === id ? { ...a, isEasy: !a.isEasy } : a));
  }
  
  function handleGoalToggle(goalNumber) {
    setTodaysGoals(prev => ({
      ...prev, [`goal${goalNumber}`]: { ...prev[`goal${goalNumber}`], completed: !prev[`goal${goalNumber}`].completed }
    }));
    autoStartTimer();
  }
  // Todos handlers
  function handleAddTodo(text) {
    setTodaysTodos(prev => [...prev, { id: Date.now(), text, completed: false }].slice(0, 5));
  }
  function handleToggleTodo(id) {
    setTodaysTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }
  function handleRemoveTodo(id) {
    setTodaysTodos(prev => prev.filter(t => t.id !== id));
  }
  function handleGratitudeChange(newGratitude) {
    setGratitude(newGratitude);
    autoStartTimer();
  }
  function getMorningCompletionCount() {
    if (mindfulnessSettings?.morningMode === 'areasReflection') {
      // feelings required for all areas; plus minRequired for content
      const feelingsOk = lifeAreas.every(a => (areasReflections?.[a]?.feeling || '').trim() !== '');
      const minReq = mindfulnessSettings?.areasMinRequired ?? 2;
      const contentCount = lifeAreas.filter(a => {
        const r = areasReflections?.[a];
        return !!(r && ((r.grateful && r.grateful.trim()) || (r.improve && r.improve.trim())));
      }).length;
      return (feelingsOk ? lifeAreas.length : 0) + Math.min(contentCount, minReq);
    } else {
      const lifeAreasCount = Object.values(morningResponses).filter(r => r.feeling !== '').length;
      const gratitudeCount = Object.values(gratitude).filter(item => item.trim() !== '').length;
      return lifeAreasCount + gratitudeCount;
    }
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
    const onePercentCount = (eveningResponses?.onePercentPlan || '').trim() !== '' ? 1 : 0;
    return goalCount + thoughtsCount + phoneCount + onePercentCount;
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
      yesterdaysDistractions,
      todaysGoals,
      lifeAreas,
      morningResponses,
      feelingOptions,
      gratitude,
      microPracticeLogs,
      abcLogs,
        mindfulnessSettings,
        environmentProfile,
        replacementAttempts,
        environmentApplications,
      anxietyRatings,
      weeklyAdjustments,
      appUsageByDate,
      sessions,
      yesterdaysOnePercentPlan,
      yesterdaysOnePercentDone,
      missedAdjustments
    });
    if (isEvening) markEveningDone();
    else setMorningCopied(true); // Mark morning content as copied
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

  function getYesterdaysSummary() {
    const items = [];
    
    // Count goals
    const goalCount = Object.values(yesterdaysGoals).filter(goal => goal.text && goal.text.trim() !== '').length;
    if (goalCount > 0) items.push(`${goalCount} goal${goalCount !== 1 ? 's' : ''}`);
    
    // Count routines
    const routineCount = yesterdaysRoutines.filter(routine => routine.text && routine.text.trim() !== '').length;
    if (routineCount > 0) items.push(`${routineCount} routine${routineCount !== 1 ? 's' : ''}`);
    
    // Count distractions
    const distractionCount = yesterdaysDistractions.length;
    if (distractionCount > 0) items.push(`${distractionCount} distraction${distractionCount !== 1 ? 's' : ''}`);
    
    // Add thoughts and phone usage
    if (yesterdaysDayThoughts && yesterdaysDayThoughts.trim() !== '') items.push('day thoughts');
    if (yesterdaysPhoneUsage && yesterdaysPhoneUsage.trim() !== '' && yesterdaysPhoneUsage !== '0m') items.push('phone usage');
    
    if (items.length === 0) return "No data from yesterday";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    
    const lastItem = items.pop();
    return `${items.join(', ')}, and ${lastItem}`;
  }

  // UI
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Floating Toolbar - Context-sensitive based on active tab */}
      {(activeTab === 'morning' || activeTab === 'evening' || activeTab === 'today') && (
        <FloatingToolbar
          // Timer display (morning/evening)
          timeLeft={timeLeft}
          showTimer={activeTab === 'morning' || activeTab === 'evening'}
          
          // Session time display (during tab with live session)
          sessionTimeElapsed={liveSession?.elapsedSeconds || 0}
          showSessionTime={activeTab === 'today' && !!liveSession}
          
          // Session controls
          liveSession={liveSession}
          onStartSession={() => setIsStartSessionOpen(true)}
          onEndSession={() => setIsEndSessionOpen(true)}
          enableSessions={!!mindfulnessSettings?.enableSessions}
          
          // Always-available actions
          onOpenToolkit={() => setIsToolkitOpen(true)}
          onOpenProtocol={() => setIsProtocolOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          
          // Copy button (morning only, when timer complete)
          showCopyButton={activeTab === 'morning' && timeLeft === 0 && getMorningCompletionCount() > 0}
          onCopy={() => copyToClipboard(false)}
          copyStatus={morningCopied}
        />
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Check-In</h1>
        <p className="text-gray-600">Track your feelings and set intentions</p>
        <AnchorNudgeBar
          frequency={mindfulnessSettings.anchorFrequency}
          microLogs={microPracticeLogs}
          seconds={mindfulnessSettings.anchorSec}
          onStartAnchor={(sec) => {
            // Open toolkit anchor via protocol or log directly
            handleLogMicroPractice('anchor');
          }}
        />
      </div>
      <Tabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        eveningDone={eveningDone}
        distractionCount={distractions.length}
        showSessions={featureFlags?.sessionsTab !== false && !!mindfulnessSettings?.enableSessions}
        showInvest={featureFlags?.investTab !== false}
        showProjects={!!featureFlags?.projectsTab}
        showDistractions={featureFlags?.distractionsTab !== false}
      />
      {/* Weekly Review temporarily disabled; will return with date setting, weekly lock, and auto-reset */}
      {false && (activeTab === 'morning' || activeTab === 'evening') && (
        <div className="mb-4 flex justify-end">
          <button className="px-3 py-2 text-xs rounded-md bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200">
            Weekly Review
          </button>
        </div>
      )}
      {activeTab === 'today' && (
        <>
          {!!featureFlags?.projectsTab && (
            <ProjectsSummary
              projects={projects}
              maxActiveProjects={mindfulnessSettings?.maxActiveProjects ?? 3}
              onToggleAction={(projectId, actionIndex) => {
                const proj = projects.find(p => p.id === projectId);
                if (!proj) return;
                const actions = Array.isArray(proj.actions) ? proj.actions.slice() : [];
                if (!actions[actionIndex]) return;
                actions[actionIndex] = { ...actions[actionIndex], done: !actions[actionIndex].done };
                updateProject(projectId, { actions });
              }}
              onOpenProject={(id) => setOpenProjectId(id)}
            />
          )}
          <TodayActionHub
          onAddDistraction={handleAddDistraction}
          onOpenSettings={() => setActiveTab('settings')}
          onStartProtocol={() => setIsProtocolOpen(true)}
          onOpenABC={() => { setAbcInitial({}); setIsABCOpen(true); }}
          onLogMicro={(type) => handleLogMicroPractice(type)}
          replacementActions={replacementActions}
          onStartReplacement={(a) => setAttemptAction(a)}
          environmentProfile={environmentProfile}
          onApplyEnvironment={handleApplyEnvironment}
          microLogs={microPracticeLogs}
          abcLogs={abcLogs}
          environmentApplications={environmentApplications}
          anchorSeconds={mindfulnessSettings.anchorSec}
          pauseSeconds={mindfulnessSettings.pauseSec}
          distractions={distractions}
          firstHour={eveningResponses.firstHour}
          onePercentPlan={eveningResponses.onePercentPlan}
          onePercentLink={eveningResponses.onePercentLink}
          onePercentDone={onePercentDone}
          onToggleOnePercentDone={() => setOnePercentDone(prev => !prev)}
          goals={todaysGoals}
          onToggleGoal={handleGoalToggle}
          todaysTodos={todaysTodos}
          onAddTodo={handleAddTodo}
          onToggleTodo={handleToggleTodo}
          onRemoveTodo={handleRemoveTodo}
          liveSession={liveSession}
          onEndSession={() => setIsEndSessionOpen(true)}
        />
        </>
      )}
      {(activeTab === 'morning' || activeTab === 'evening') && (
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
          canMarkDone={activeTab === 'evening' && !eveningDone && getEveningCompletionCount() === 6}
        />
      )}
      <div className="text-sm text-gray-600 mb-8">
        {activeTab === 'morning' ? (
          <>Progress: {getMorningCompletionCount()}/{lifeAreas.length + 3} items completed</>
        ) : (
          <>Progress: {getEveningCompletionCount()}/6 items completed {eveningDone && <span className="text-green-600 font-semibold">✓ Locked</span>}</>
        )}
      </div>
      {/* Morning Tab Content */}
      {activeTab === 'morning' && (
        <>
          {/* Yesterday's Section - Now Collapsible */}
          <CollapsibleSection
            title="Yesterday's Review"
            icon="📅"
            summary={getYesterdaysSummary()}
            defaultExpanded={false}
          >
            <GoalsList goals={yesterdaysGoals} editable={false} title="Yesterday's Goals" colorClass="bg-gray-50" />
            {yesterdaysOnePercentPlan && yesterdaysOnePercentPlan.trim() !== '' && (
              <div className="mb-4 p-3 rounded-lg border-2 border-emerald-500 bg-emerald-50">
                <div className="text-sm text-emerald-900 font-semibold mb-1">📈 Yesterday's 1% Learning</div>
                <div className="flex items-center gap-2 text-sm text-emerald-900">
                  <span className="text-base">{yesterdaysOnePercentDone ? '✅' : '⏳'}</span>
                  <span>{yesterdaysOnePercentPlan}</span>
                </div>
              </div>
            )}
            {(() => {
              const secs = getUsageSecondsFor(new Date(Date.now() - 24 * 3600 * 1000));
              if (secs <= 0) return null;
              return (
                <div className="mb-4 p-3 rounded-lg border border-indigo-200 bg-indigo-50">
                  <div className="text-sm text-indigo-900">App usage yesterday: <span className="font-semibold">{formatDurationShort(secs)}</span></div>
                </div>
              );
            })()}
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
            {/* Yesterday's Focus & Distraction Reflection */}
            {yesterdaysDistractions.length > 0 && (
              <div className="mb-6">
                <DistractionInsights
                  distractions={yesterdaysDistractions}
                  title="Yesterday's Focus & Distraction Reflection"
                  showFullDetails={true}
                  colorTheme="gray"
                />
              </div>
            )}
          </CollapsibleSection>

          {/* Today's Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b-2 border-blue-200 pb-2">
              🌟 Today's Focus
            </h2>
            {/* First Hour Activity Display */}
            {eveningResponses.firstHour && eveningResponses.firstHour.trim() && (
              <div className="mb-6 p-4 border-2 border-blue-500 bg-blue-50 rounded-lg flex items-center gap-4">
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
            
            {/* Daily Routines Tracking (setup is in Settings) */}
            <DailyRoutineInput
              routines={dailyRoutines}
              onRoutineToggle={(index) => {
                const newRoutines = [...dailyRoutines];
                newRoutines[index] = { ...newRoutines[index], completed: !newRoutines[index].completed };
                setDailyRoutines(newRoutines);
                autoStartTimer();
              }}
              editable={false}
              showCheckboxes={true}
              title="Today's Daily Routines"
              colorClass="bg-green-50"
            />
          </div>
          
          {/* Reflection Mode */}
          {mindfulnessSettings?.morningMode === 'areasReflection' ? (
            <LifeAreasReflection
              lifeAreas={lifeAreas}
              reflections={areasReflections}
              onChange={setAreasReflections}
              minRequired={mindfulnessSettings?.areasMinRequired ?? 2}
              onAnyChange={autoStartTimer}
              style={mindfulnessSettings?.areasStyle ?? 'unfold'}
            />
          ) : (
            <GratitudeInput
              gratitude={gratitude}
              onGratitudeChange={handleGratitudeChange}
              editable={true}
              yesterdaysGratitude={yesterdaysGratitude}
            />
          )}

          {/* Optional Todos */}
          <TodosList
            todos={todaysTodos}
            onAdd={handleAddTodo}
            onToggle={handleToggleTodo}
            onRemove={handleRemoveTodo}
            editable={true}
          />
          
          {mindfulnessSettings?.morningMode !== 'areasReflection' && (
            <LifeAreasGrid
              lifeAreas={lifeAreas}
              morningResponses={morningResponses}
              setMorningResponses={setMorningResponses}
              feelingOptions={feelingOptions}
              editable={true}
              onAnyChange={autoStartTimer}
            />
          )}
          {/* ABC Highlights (today) */}
          <ABCHighlights logs={abcLogs} onAddABC={() => { setAbcInitial({}); setIsABCOpen(true); }} />
          {/* Environment Checklist Today */}
          <EnvironmentChecklist
            profile={environmentProfile}
            appliedToday={environmentApplications.filter(a => {
              const d = new Date(a.ts); const t = new Date();
              return d.toDateString() === t.toDateString();
            })}
            onApply={handleApplyEnvironment}
          />
          {/* What worked today */}
          <WhatWorkedToday microLogs={microPracticeLogs} />
          {Array.isArray(missedAdjustments) && missedAdjustments.length > 0 && (
            <div className="mb-6 p-4 rounded-lg border-2 border-amber-400 bg-amber-50">
              <h3 className="text-base font-semibold text-amber-900 mb-2">Adjustments from yesterday’s misses</h3>
              <ul className="list-disc ml-5 space-y-1 text-sm text-amber-900">
                {missedAdjustments.map((it, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{it.text}</span>
                    {it.counters?.length ? <span> — Next: {it.counters.join(', ')}</span> : null}
                    {it.causes?.length ? <span> — Why: {it.causes.join(', ')}</span> : null}
                    {it.note ? <span> — {it.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
                yesterdaysDistractions,
                todaysGoals,
                lifeAreas,
                morningResponses,
                feelingOptions,
                gratitude,
                yesterdaysGratitude,
                microPracticeLogs,
                abcLogs,
                mindfulnessSettings,
                environmentProfile,
                replacementAttempts,
                environmentApplications,
                anxietyRatings
                ,sessions,
                yesterdaysOnePercentPlan,
                yesterdaysOnePercentDone
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
          {(() => {
            const secs = getUsageSecondsFor(new Date());
            return (
              <div className="mb-4 p-3 rounded-lg border border-indigo-200 bg-indigo-50">
                <div className="text-sm text-indigo-900">App usage today: <span className="font-semibold">{formatDurationShort(secs)}</span></div>
              </div>
            );
          })()}
          <PhoneUsageInput
            value={eveningResponses.phoneUsage}
            onChange={handlePhoneUsageChange}
            editable={!eveningDone}
            label="Phone Usage Time"
            colorClass="bg-red-50"
          />
          <EveningGoalsWithProjects
            eveningResponses={eveningResponses}
            onGoalChange={handleEveningGoalChange}
            onFirstHourChange={handleFirstHourChange}
            onOnePercentPlanChange={handleOnePercentPlanChange}
            onOnePercentLinkChange={handleOnePercentLinkChange}
            editable={!eveningDone}
            projects={projects}
            todaysTodos={todaysTodos}
            onAddTodo={handleAddTodo}
          />
          {/* Tomorrow's Todos (Evening planning) — uses the same list, only cleared by evening reset */}
          <TodosList
            title="Tomorrow's Todos (optional)"
            todos={todaysTodos}
            onAdd={handleAddTodo}
            onToggle={handleToggleTodo}
            onRemove={handleRemoveTodo}
            editable={!eveningDone}
          />
          {/* Replacement Actions editor is moved primarily to Settings; leave out from Evening execution */}
          <DayThoughtsPanel
            value={eveningResponses.dayThoughts}
            onChange={handleEveningThoughtsChange}
            editable={!eveningDone}
            label="Day Thoughts"
            colorClass="bg-white"
            placeholder="Reflect on your day... wins, challenges, insights, or anything on your mind"
            onAddABC={() => { setAbcInitial({}); setIsABCOpen(true); }}
          />
          {/* ABC Highlights (today) */}
          <ABCHighlights logs={abcLogs} onAddABC={() => { setAbcInitial({}); setIsABCOpen(true); }} />
          
          {/* Daily Routines Setup removed - now in Settings tab */}
          
          {/* Distraction Insights */}
          <DistractionInsights
            distractions={distractions}
            title="Today's Focus & Distraction Reflection"
            showFullDetails={true}
            colorTheme="purple"
            microLogs={microPracticeLogs}
            environmentApplications={environmentApplications}
            environmentProfile={environmentProfile}
            abcLogs={abcLogs}
            anxietyRatings={anxietyRatings}
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
                yesterdaysDistractions,
                todaysGoals,
                lifeAreas,
                morningResponses,
                feelingOptions,
                gratitude,
                yesterdaysGratitude,
                microPracticeLogs,
                abcLogs,
                mindfulnessSettings,
                environmentProfile,
                replacementAttempts,
                environmentApplications,
                anxietyRatings
                ,sessions
              })}
              onCopy={() => copyToClipboard(true)}
              googleDocsUrl="https://docs.google.com/document/u/0/"
              previewLabel="Preview:"
            />
          )}
        </>
      )}
      {activeTab === 'sessions' && featureFlags?.sessionsTab !== false && !!mindfulnessSettings?.enableSessions && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sessions</h2>
          <SessionsDashboard
            sessions={sessions}
            hooks={hooks}
            onUpdateHook={(hookId, partial) => {
              setHooks(prev => prev.map(h => h.id === hookId ? { ...h, ...partial } : h));
            }}
          />
        </div>
      )}
      {activeTab === 'projects' && !!featureFlags?.projectsTab && (
        <>
          <ProjectsSummary
            projects={projects}
            maxActiveProjects={mindfulnessSettings?.maxActiveProjects ?? 3}
            onToggleAction={(projectId, actionIndex) => {
              const proj = projects.find(p => p.id === projectId);
              if (!proj) return;
              const actions = Array.isArray(proj.actions) ? proj.actions.slice() : [];
              if (!actions[actionIndex]) return;
              actions[actionIndex] = { ...actions[actionIndex], done: !actions[actionIndex].done };
              updateProject(projectId, { actions });
            }}
            onOpenProject={(id) => setOpenProjectId(id)}
          />
          <ProjectsTab
            projects={projects}
            onCreate={() => {
              const id = addProject();
              setOpenProjectId(id);
            }}
            onOpen={(id) => {
              setOpenProjectId(id);
            }}
          />
        </>
      )}
      {activeTab === 'invest' && (
        <InvestTab
          opportunities={investOpportunities}
          decisions={investDecisions}
          onCopyDecision={(d) => {
            const opp = investOpportunities.find(o => o.id === d.opportunityId);
            const snippet = `Decision: ${d.type.toUpperCase()}\nOpportunity: ${opp?.title || ''}\nDate: ${new Date(d.decidedAt).toLocaleString()}\nReasons: ${(d.reasons||[]).join(', ') || '-'}\nRisk: ${d.risk || '-'}\nPremortem: ${d.premortem || '-'}`;
            try { navigator.clipboard.writeText(snippet); alert('Copied decision snippet'); } catch {}
          }}
          onAddOpportunity={({ title, docUrl, tagId }) => {
            const item = { id: Date.now().toString(), title, docUrl, tagId: tagId || null, status: 'Backlog', createdAt: Date.now(), timeSpentSec: 0 };
            setInvestOpportunities(prev => [item, ...prev]);
          }}
          onUpdateOpportunity={(id, partial) => {
            setInvestOpportunities(prev => prev.map(o => o.id === id ? { ...o, ...partial } : o));
          }}
          onDeleteOpportunity={(id) => {
            setInvestOpportunities(prev => prev.filter(o => o.id !== id));
          }}
          onStartSprint={(id, kind) => {
            // Reading usage enforcement: soft cap
            const todayISO = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toISOString().slice(0,10);
            const settingsCap = mindfulnessSettings?.investReadingCapMin ?? 0;
            const usedMin = Math.floor((investReadingUsageByDate?.[todayISO] || 0)/60);
            if (kind === 'reading' && settingsCap > 0 && usedMin >= settingsCap) {
              const ok = window.confirm(`Reading cap reached (${usedMin}/${settingsCap} min). Use a 10m joker?`);
              if (!ok) return;
              // allow 10 more minutes implicitly
            }
            setActiveTab('sessions');
            setIsStartSessionOpen(true);
            const opp = investOpportunities.find(o => o.id === id);
            if (opp) setHooks(prev => [{ id: `opp-${id}`, label: `Opp: ${opp.title}`, type: 'invest' }, ...prev]);
          }}
          onDecide={(id, payload) => {
            const opp = investOpportunities.find(o => o.id === id);
            if (!opp || !payload) return;
            const dec = { id: Date.now().toString(), opportunityId: id, type: payload.type, reasons: payload.reasons || [], risk: payload.risk || '', premortem: payload.premortem || '', decidedAt: Date.now() };
            setInvestDecisions(prev => [dec, ...prev]);
            setInvestOpportunities(prev => prev.map(o => o.id === id ? { ...o, status: 'Decided' } : o));
          }}
          readingUsedMin={Math.floor(((() => { const d=new Date(); const iso=new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10); return investReadingUsageByDate?.[iso] || 0; })())/60)}
          readingCapMin={mindfulnessSettings?.investReadingCapMin ?? 0}
        />
      )}
      {/* Settings Tab Content */}
      {activeTab === 'settings' && (
        <Settings
          dailyRoutines={dailyRoutines}
          onDailyRoutineChange={handleDailyRoutineChange}
          mindfulnessSettings={mindfulnessSettings}
          onMindfulnessSettingsChange={setMindfulnessSettings}
          replacementActions={replacementActions}
          onAddReplacementAction={handleAddReplacementAction}
          onRemoveReplacementAction={handleRemoveReplacementAction}
          onToggleReplacementEasy={handleToggleEasy}
          environmentProfile={environmentProfile}
          onEnvironmentProfileChange={setEnvironmentProfile}
          featureFlags={featureFlags}
          onFeatureFlagsChange={setFeatureFlags}
        />
      )}
      <ProjectDetailModal
        isOpen={!!openProjectId}
        onClose={() => setOpenProjectId(null)}
        project={projects.find(p => p.id === openProjectId)}
        onUpdate={(partial) => {
          if (!openProjectId) return;
          updateProject(openProjectId, partial);
        }}
        onSetNextAction={(actionIndex) => {
          if (!openProjectId) return;
          setNextAction(openProjectId, actionIndex);
        }}
        onDelete={() => {
          if (!openProjectId) return;
          const ok = window.confirm('Delete this project?');
          if (ok) {
            removeProject(openProjectId);
            setOpenProjectId(null);
          }
        }}
      />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SessionStarterModal
        isOpen={isStartSessionOpen}
        onClose={() => setIsStartSessionOpen(false)}
        hooks={hooks}
        onAddHook={({ label, type }) => {
          const item = { id: Date.now().toString(), label, type };
          setHooks(prev => [item, ...prev]);
          return item;
        }}
        onStart={({ hookId, hookLabel, questTitle, plannedMin }) => {
          const session = { id: Date.now().toString(), startedAt: Date.now(), hookId, hookLabel, questTitle, plannedMin };
          setLiveSession(session);
          setSessions(prev => [session, ...prev]);
          setIsStartSessionOpen(false);
        }}
      />
      <SessionEnderModal
        isOpen={isEndSessionOpen}
        onClose={() => setIsEndSessionOpen(false)}
        onEnd={({ enjoyment, highlight, rewardTaken }) => {
          if (!liveSession) { setIsEndSessionOpen(false); return; }
          const updated = { ...liveSession, endedAt: Date.now(), enjoyment, highlight, rewardTaken, minutes: Math.max(1, Math.round(((Date.now() - liveSession.startedAt) / 60000))) };
          setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
          setLiveSession(null);
          setIsEndSessionOpen(false);
        }}
      />
      <EveningResetConfirm
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        todaysGoals={todaysGoals}
        todaysTodos={todaysTodos}
        onePercentPlan={eveningResponses.onePercentPlan}
        onePercentDone={onePercentDone}
        onConfirm={(localStatuses) => {
          setIsResetConfirmOpen(false);
          // apply completion statuses before reset
          const updatedGoals = {
            goal1: { ...todaysGoals.goal1, completed: !!localStatuses.goal1 },
            goal2: { ...todaysGoals.goal2, completed: !!localStatuses.goal2 },
            goal3: { ...todaysGoals.goal3, completed: !!localStatuses.goal3 },
          };
          // reflect in yesterday's goals exactly as morning does
          setYesterdaysGoals(updatedGoals);
          // reflect todos in yesterday's
          const updatedTodos = (todaysTodos || []).map((t, idx) => ({ ...t, completed: !!(localStatuses.todos?.[idx]?.completed) }));
          setYesterdaysTodos(updatedTodos);
          // persist 1% done and carry plan to yesterday for morning export
          setOnePercentDone(!!localStatuses.onePercentDone);
          setYesterdaysOnePercentPlan(eveningResponses.onePercentPlan || '');
          setYesterdaysOnePercentDone(!!localStatuses.onePercentDone);
          // also set today's goals state so UI reflects prior to reset
          setTodaysGoals(updatedGoals);
          // collect missed adjustments
          try {
            const items = [];
            [1,2,3].forEach(n => {
              const key = `goal${n}`;
              const text = todaysGoals?.[key]?.text || '';
              if (text && !localStatuses[key]) {
                items.push({ type: 'goal', text, causes: localStatuses[`${key}Meta`]?.causes || [], counters: localStatuses[`${key}Meta`]?.counters || [], note: localStatuses[`${key}Meta`]?.note || '', carry: !!localStatuses[`${key}Meta`]?.carry });
              }
            });
            (todaysTodos || []).forEach((t, idx) => {
              if (!localStatuses.todos?.[idx]?.completed) {
                const meta = localStatuses.todosMeta?.[idx] || {};
                items.push({ type: 'todo', text: t.text, causes: meta.causes || [], counters: meta.counters || [], note: meta.note || '', carry: !!meta.carry });
              }
            });
            if ((eveningResponses.onePercentPlan || '').trim() && !localStatuses.onePercentDone) {
              const meta = localStatuses.onePercentMeta || {};
              items.push({ type: 'onePercent', text: eveningResponses.onePercentPlan, causes: meta.causes || [], counters: meta.counters || [], note: meta.note || '', carry: !!meta.carry });
            }
            if (items.length > 0) setMissedAdjustments(items);
            // carry-forward to tomorrow's todos if selected
            const carryTodos = items.filter(it => it.carry && it.text).map(it => ({ id: Date.now() + Math.random(), text: it.text, completed: false }));
            if (carryTodos.length > 0) {
              setTodaysTodos(carryTodos.slice(0, 5));
            }
          } catch {}
          // Clear today's/tomorrow's shared todos only on evening reset
          setTodaysTodos([]);
          // continue with reset flow
          try {
            setIsRunning(false);
            setTimeLeft(120);
            setIsComplete(false);
            setHasUsedExtraTime(false);
            setYesterdaysDayThoughts(eveningResponses.dayThoughts);
            setTodaysGoals(defaultGoals);
            setEveningResponses(defaultEveningResponses);
            setEveningDone(false);
            setDistractions([]);
          } catch (e) {
            setIsRunning(false);
            setTimeLeft(120);
            setIsComplete(false);
            setHasUsedExtraTime(false);
            setEveningDone(false);
            setDistractions([]);
          }
        }}
      />
      {false && (
        <div />
      )}
      {/* Distractions Tab Content */}
      {activeTab === 'distractions' && featureFlags?.distractionsTab !== false && (
        <DistractionTracker
          distractions={distractions}
          onAddDistraction={handleAddDistraction}
          onRemoveDistraction={handleRemoveDistraction}
          onClearAll={handleClearAllDistractions}
          onSuggestABC={(initial) => { if (mindfulnessSettings.enablePrompts) { setAbcInitial(initial); setIsABCOpen(true); } }}
          onQuickInterrupt={(type, source, trigger) => { if (mindfulnessSettings.enablePrompts) handleLogMicroPractice(type, source, trigger); }}
          replacementActions={replacementActions}
          onStartReplacement={(a) => setAttemptAction(a)}
          environmentProfile={environmentProfile}
          onApplyEnvironment={handleApplyEnvironment}
          onOpenSettings={() => setActiveTab('settings')}
          onOpenEnvModal={() => {/* reuse Distractions-level modal if needed; handled inside tracker */}}
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
              'distractions',
              'yesterdaysDistractions',
              'gratitude',
              'yesterdaysGratitude',
              'mindfulnessSettings',
              'microPracticeLogs',
              'abcLogs'
              ,'replacementActions'
              ,'environmentProfile'
              ,'environmentApplications'
              ,'replacementAttempts'
              ,'anxietyRatings'
              ,'todaysTodos'
              ,'yesterdaysTodos'
              ,'appUsageByDate'
            ].forEach(key => localStorage.removeItem(key));
            window.location.reload();
          }
        }}
      >
        Reset All Data
      </button>
      {/* Reset Sessions Data Button */}
      <button
        className="mt-3 ml-3 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg border border-purple-300 hover:bg-purple-200 transition-colors"
        onClick={() => {
          if (window.confirm('Reset all Sessions data? This clears past sessions and ends any live session.')) {
            try {
              localStorage.removeItem('sessions');
              setSessions([]);
              setLiveSession(null);
              alert('Sessions data cleared.');
            } catch (e) {
              // fallback
              setSessions([]);
              setLiveSession(null);
            }
          }
        }}
      >
        Reset Sessions Data
      </button>
      {/* Overlays */}
      <MindfulnessToolkit
        isOpen={isToolkitOpen}
        onClose={() => setIsToolkitOpen(false)}
        settings={mindfulnessSettings}
        onLogMicro={(type) => handleLogMicroPractice(type)}
      />
      <ABCLogger
        isOpen={isABCOpen}
        onClose={() => setIsABCOpen(false)}
        onSave={handleSaveABC}
        initial={abcInitial}
      />
      {attemptAction && (
        <ReplacementAttempt
          action={attemptAction}
          onComplete={({ rewardGiven, helped, actionTitle }) => {
            // minimal attempt logging; future: store replacementAttempts in state
            setAttemptAction(null);
            const entry = { id: Date.now(), ts: Date.now(), actionId: attemptAction.id, title: attemptAction.title, durationSec: 120, completed: true, rewardGiven, helped };
            if (linkedDistractionId) {
              entry.linkedDistractionId = linkedDistractionId;
            }
            setReplacementAttempts(prev => [entry, ...prev]);
            handleLogMicroPractice('replacement', 'manual', undefined, { helped, actionTitle });
            if (rewardGiven) {
              handleLogMicroPractice('reward', 'manual');
            }
            setLinkedDistractionId(null);
          }}
          onCancel={() => setAttemptAction(null)}
        />
      )}
      <FiveStepProtocol
        isOpen={isProtocolOpen}
        onClose={() => setIsProtocolOpen(false)}
        onSaveABC={(data) => handleSaveABC(data)}
        onLogMicro={(type) => handleLogMicroPractice(type)}
        replacementActions={replacementActions}
        onStartReplacement={(a) => setAttemptAction(a)}
        environmentProfile={environmentProfile}
        onApplyEnvironment={(item) => handleApplyEnvironment(item)}
        onCompleteSession={() => { /* placeholder for history logging */ }}
        onSaveAnxiety={({ rating, notes }) => {
          setAnxietyRatings(prev => [{ id: Date.now(), ts: Date.now(), rating, notes }, ...prev]);
        }}
        onOpenSettings={() => setActiveTab('settings')}
      />
    </div>
  );
}