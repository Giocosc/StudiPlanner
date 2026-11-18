/**
 * Study Plan Rebalancer Engine
 * Handles calendar calculations, full-time work exclusions,
 * +20% high-priority buffers, and dynamic weekly/daily schedule allocation.
 * 
 * Supports ROLLING REBALANCING:
 * - If days are missed/skipped, uncompleted topics automatically roll forward to Today.
 * - If topics are completed ahead of time, future days automatically pull forward.
 * - Full historical tracking of past dates (completed vs skipped days).
 */

export function getLocalTodayDateStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;
  // Clamp within session bounds if outside
  if (dateStr < "2026-11-16") return "2026-11-16";
  if (dateStr > "2027-01-10") return "2027-01-10";
  return dateStr;
}

export function addDaysToDateStr(dateStr, days) {
  if (!dateStr) return dateStr;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().split("T")[0];
}

/**
 * Heuristic Predictor for Exam Pass Probability & Expected Grade Range
 */
export function calculateExamReadinessAndGrade(topics, metrics) {
  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => Boolean(t.completato !== undefined ? t.completato : t.isCompleted)).length;
  const completionRate = totalTopics > 0 ? completedTopics / totalTopics : 0;

  const pastDaysTotal = (metrics.pastDaysStudied || 0) + (metrics.pastDaysSkipped || 0);
  const consistencyRate = pastDaysTotal > 0 ? (metrics.pastDaysStudied || 0) / pastDaysTotal : 1.0;

  const requiredHours = metrics.requiredWeeklyHours || 20;

  let readinessScore = 55; // baseline

  // 1. Weekly workload pace factor
  if (requiredHours <= 18) readinessScore += 25;
  else if (requiredHours <= 22) readinessScore += 15;
  else if (requiredHours <= 25) readinessScore += 5;
  else if (requiredHours <= 28) readinessScore -= 12;
  else if (requiredHours <= 32) readinessScore -= 25;
  else readinessScore -= 35;

  // 2. Consistency factor
  if (consistencyRate >= 0.85) readinessScore += 20;
  else if (consistencyRate >= 0.7) readinessScore += 10;
  else if (consistencyRate >= 0.5) readinessScore -= 5;
  else readinessScore -= 20;

  // 3. Completion progress bonus
  readinessScore += Math.round(completionRate * 25);

  readinessScore = Math.max(10, Math.min(98, readinessScore));

  let gradeLabel, riskLevel, riskColor;

  if (readinessScore >= 80) {
    gradeLabel = "28 - 30 e Lode";
    riskLevel = "Basso (Fascia Eccellenza)";
    riskColor = "emerald";
  } else if (readinessScore >= 65) {
    gradeLabel = "24 - 27 / 30";
    riskLevel = "Moderato (Fascia Sicurezza)";
    riskColor = "cyan";
  } else if (readinessScore >= 48) {
    gradeLabel = "18 - 23 / 30";
    riskLevel = "Attenzione (Fascia Minima)";
    riskColor = "amber";
  } else {
    gradeLabel = "< 18 (Rischio Insufficienza)";
    riskLevel = "Critico (Rischio Bocciatura)";
    riskColor = "rose";
  }

  const passProbability = Math.round(Math.min(99, Math.max(15, readinessScore * 1.05)));

  return {
    readinessScore,
    passProbability,
    gradeLabel,
    riskLevel,
    riskColor,
    consistencyRate: Math.round(consistencyRate * 100),
    requiredWeeklyHours: requiredHours,
    completionPercent: Math.round(completionRate * 100)
  };
}

export const DEFAULT_SETTINGS = {
  roadmapStartDate: "2026-11-16", // Start of winter session roadmap
  targetExamDate: "2027-01-10",
  currentSimulatedDate: getLocalTodayDateStr(), // Active date: synchronized with real today!
  criticalWeeklyHoursThreshold: 25.0, // Base lavoratore full-time
  eveningStudyHours: 2.5, // 19:30 - 22:00 (2.5h)
  weekdayStudyHours: 2.5, // Standard feriale base
  weekendStudyHours: 4.5, // Dedicated blocks (Sat, Sun)
  highPriorityThreshold: 4, // 4 or 5 triggers high priority buffer
  bufferMultiplier: 1.2, // +20% time buffer
  interleaveSubjects: true, // Alternate Analisi and Geometria across days
  studyDays: {
    1: { name: "Lunedì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Sera (19:30 - 22:00)" },
    2: { name: "Martedì", enabled: true, isWeekend: false, defaultSubject: "Geometria", timeSlot: "Sera (19:30 - 22:00)" },
    3: { name: "Mercoledì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Sera (19:30 - 22:00)" },
    4: { name: "Giovedì", enabled: true, isWeekend: false, defaultSubject: "Geometria", timeSlot: "Sera (19:30 - 22:00)" },
    5: { name: "Venerdì", enabled: true, isWeekend: false, defaultSubject: "Analisi 1", timeSlot: "Sera (19:00 - 21:30)" },
    6: { name: "Sabato", enabled: true, isWeekend: true, defaultSubject: "Misto", timeSlot: "Mattina + Pomeriggio" },
    0: { name: "Domenica", enabled: true, isWeekend: true, defaultSubject: "Misto", timeSlot: "Pomeriggio + Ripasso" }
  }
};

/**
 * Calculates days and weeks difference
 */
export function getCalendarMetrics(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  // Normalize to UTC midnight
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  
  const diffMs = endUtc - startUtc;
  const remainingDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  const remainingWeeks = Math.max(0.1, remainingDays / 7);

  return {
    remainingDays,
    remainingWeeks: Number(remainingWeeks.toFixed(1)),
    isPastExam: diffMs <= 0
  };
}

/**
 * Calculates progress for each subject and total
 */
export function calculateSubjectProgress(topics) {
  const result = {
    analisi: { totalHours: 0, completedHours: 0, percent: 0, totalCount: 0, completedCount: 0, remainingHours: 0 },
    geometria: { totalHours: 0, completedHours: 0, percent: 0, totalCount: 0, completedCount: 0, remainingHours: 0 },
    global: { totalHours: 0, completedHours: 0, percent: 0, totalCount: 0, completedCount: 0, remainingHours: 0 }
  };

  topics.forEach(t => {
    const isAnalisi = t.materia.toLowerCase().includes("analisi");
    const sub = isAnalisi ? result.analisi : result.geometria;
    const stimate = Number(t.oreStimate) || 2.0;
    const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
    const effettive = Number(t.oreEffettive || 0);

    // Ore residue: se completato sono 0, altrimenti max(0, oreStimate - oreEffettive)
    const residue = isDone ? 0 : Math.max(0, Number((stimate - effettive).toFixed(2)));

    sub.totalCount += 1;
    sub.totalHours += stimate;
    result.global.totalCount += 1;
    result.global.totalHours += stimate;

    // Calcolo ore svolte basato sulla somma totale di oreEffettive registrate
    // (fallback a oreStimate per compatibilità se completato ma oreEffettive non impostato)
    const actualSpent = isDone && effettive === 0 ? stimate : effettive;
    sub.completedHours += actualSpent;
    result.global.completedHours += actualSpent;

    if (isDone) {
      sub.completedCount += 1;
      result.global.completedCount += 1;
    }

    sub.remainingHours += residue;
    result.global.remainingHours += residue;
  });

  // Calculate percentages based on effective hours logged
  result.analisi.percent = result.analisi.totalHours > 0
    ? Math.min(100, Math.round((result.analisi.completedHours / result.analisi.totalHours) * 100))
    : 0;
  result.geometria.percent = result.geometria.totalHours > 0
    ? Math.min(100, Math.round((result.geometria.completedHours / result.geometria.totalHours) * 100))
    : 0;
  result.global.percent = result.global.totalHours > 0
    ? Math.min(100, Math.round((result.global.completedHours / result.global.totalHours) * 100))
    : 0;

  // Round numbers
  result.analisi.totalHours = Number(result.analisi.totalHours.toFixed(1));
  result.analisi.completedHours = Number(result.analisi.completedHours.toFixed(1));
  result.analisi.remainingHours = Number(result.analisi.remainingHours.toFixed(1));

  result.geometria.totalHours = Number(result.geometria.totalHours.toFixed(1));
  result.geometria.completedHours = Number(result.geometria.completedHours.toFixed(1));
  result.geometria.remainingHours = Number(result.geometria.remainingHours.toFixed(1));

  result.global.totalHours = Number(result.global.totalHours.toFixed(1));
  result.global.completedHours = Number(result.global.completedHours.toFixed(1));
  result.global.remainingHours = Number(result.global.remainingHours.toFixed(1));

  return result;
}

/**
 * Natural sequential ID comparator (e.g. A-01, A-02, ..., A-32 and G-01, G-02, ..., G-31)
 */
function sortBySequentialId(a, b) {
  const matchA = String(a.id || "").match(/\d+/);
  const matchB = String(b.id || "").match(/\d+/);
  const numA = matchA ? parseInt(matchA[0], 10) : 999;
  const numB = matchB ? parseInt(matchB[0], 10) : 999;
  if (numA !== numB) return numA - numB;
  return String(a.id || "").localeCompare(String(b.id || ""), undefined, { numeric: true, sensitivity: "base" });
}

/**
 * Main rolling rebalancing function:
 * 1. Tracks history of past days from roadmapStartDate to currentSimulatedDate.
 * 2. Takes uncompleted topics and dynamically packs them starting from Today (currentSimulatedDate) onwards.
 * 3. Shifts topics forward automatically if days were missed.
 * 4. Pulls topics forward automatically if ahead of schedule.
 */
export function rebalanceStudyPlan(topics, customSettings = {}, customDayCapacities = {}, studySessions = []) {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const dayCapacities = (customDayCapacities && typeof customDayCapacities === "object" && Object.keys(customDayCapacities).length > 0)
    ? customDayCapacities
    : (customSettings && customSettings.customDayCapacities ? customSettings.customDayCapacities : {});
  const sessions = Array.isArray(studySessions) && studySessions.length > 0
    ? studySessions
    : (customSettings && Array.isArray(customSettings.studySessions) ? customSettings.studySessions : []);

  const { remainingDays, remainingWeeks } = getCalendarMetrics(settings.currentSimulatedDate, settings.targetExamDate);

  // 1. Process and weigh topics with Granular Partial Progress (oreResidue)
  const processedTopics = topics.map(t => {
    const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
    const oreStimate = Number(t.oreStimate) || 2.0;
    const oreEffettive = Number(t.oreEffettive || 0);
    // Formula: const oreResidue = completato ? 0 : Math.max(0, oreStimate - oreEffettive);
    const oreResidue = isDone ? 0 : Math.max(0, Number((oreStimate - oreEffettive).toFixed(2)));

    const isHighPriority = (t.prioritaEsame || 3) >= settings.highPriorityThreshold;
    const isHighDifficulty = (t.difficolta || 3) >= settings.highPriorityThreshold;
    const hasBuffer = isHighPriority || isHighDifficulty;

    // Quando l'algoritmo spalma sui giorni futuri, usa oreResidue invece di oreStimate
    const baseHours = oreResidue;
    const effectiveHours = hasBuffer
      ? Number((baseHours * settings.bufferMultiplier).toFixed(2))
      : baseHours;

    return {
      ...t,
      completato: isDone,
      isCompleted: isDone,
      oreStimate,
      oreEffettive,
      oreResidue,
      baseHours,
      effectiveHours,
      hasBuffer,
      bufferDelta: Number((effectiveHours - baseHours).toFixed(2))
    };
  });

  // Filter topics with remaining workload to schedule forward
  const uncompletedToSchedule = processedTopics.filter(t => !t.completato && t.oreResidue > 0);

  // Total remaining workload from Today forward
  const totalRemainingBaseHours = Number(
    uncompletedToSchedule.reduce((acc, t) => acc + t.baseHours, 0).toFixed(1)
  );
  const totalRemainingEffectiveHours = Number(
    uncompletedToSchedule.reduce((acc, t) => acc + t.effectiveHours, 0).toFixed(1)
  );
  const totalBufferHours = Number((totalRemainingEffectiveHours - totalRemainingBaseHours).toFixed(1));

  // Baseline standard capacities (weekday evening & weekend blocks)
  const standardWeekdayHours = Number(settings.weekdayStudyHours !== undefined ? settings.weekdayStudyHours : (settings.eveningStudyHours || 2.5));
  const standardWeekendHours = Number(settings.weekendStudyHours || 4.5);

  // Nominal baseline weekly capacity: (5 * feriali) + (2 * weekend)
  const nominalWeeklyCapacity = Number(((standardWeekdayHours * 5) + (standardWeekendHours * 2)).toFixed(1));
  const dynamicCriticalThreshold = (customSettings && customSettings.criticalWeeklyHoursThreshold)
    ? Number(customSettings.criticalWeeklyHoursThreshold)
    : (settings.criticalWeeklyHoursThreshold || 25.0);

  // Required weekly pace to finish by targetExamDate
  const requiredWeeklyHours = Number((totalRemainingEffectiveHours / Math.max(1, remainingWeeks)).toFixed(1));
  const isCriticalOverload = requiredWeeklyHours > dynamicCriticalThreshold;

  // 2. Generate FULL calendar from roadmapStartDate to targetExamDate
  const allCalendarDays = [];
  const startDate = new Date(settings.roadmapStartDate || "2026-11-16");
  const todayDate = new Date(settings.currentSimulatedDate);
  const targetDate = new Date(settings.targetExamDate);

  const startUtc = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

  let curDate = new Date(startDate);
  let dayOffset = 0;

  while (curDate <= targetDate && dayOffset < 150) {
    const dayOfWeek = curDate.getDay(); // 0 is Sunday, 1 is Monday...
    const dayConfig = settings.studyDays[dayOfWeek] || { enabled: true, isWeekend: false, name: "Giorno" };
    const dateStr = curDate.toISOString().split("T")[0];

    const curUtc = Date.UTC(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());
    const weekIndex = Math.floor((curUtc - startUtc) / (1000 * 60 * 60 * 24 * 7)) + 1;

    const isPast = dateStr < settings.currentSimulatedDate;
    const isToday = dateStr === settings.currentSimulatedDate;
    const isFuture = dateStr > settings.currentSimulatedDate;

    // Standard fallback capacity from settings
    const fallbackHours = dayConfig.isWeekend ? standardWeekendHours : standardWeekdayHours;

    // Dynamic Daily Capacity Override (Time Shifter)
    const hasCustomOverride = Boolean(
      dayCapacities &&
      Object.prototype.hasOwnProperty.call(dayCapacities, dateStr) &&
      dayCapacities[dateStr] !== null &&
      dayCapacities[dateStr] !== undefined
    );
    const maxDayHours = hasCustomOverride ? Math.max(0, Number(dayCapacities[dateStr])) : fallbackHours;

    let timeSlotDescription = "";
    if (hasCustomOverride) {
      if (maxDayHours > fallbackHours) {
        timeSlotDescription = `Slot Extra Attivo (${maxDayHours}h)`;
      } else if (maxDayHours < fallbackHours) {
        timeSlotDescription = `Budget Ridotto (${maxDayHours}h)`;
      } else {
        timeSlotDescription = `Budget Personalizzato (${maxDayHours}h)`;
      }
    } else if (dayConfig.isWeekend) {
      timeSlotDescription = dayConfig.timeSlot || `Blocco Weekend (${maxDayHours}h)`;
    } else {
      timeSlotDescription = dayConfig.timeSlot || `Sera (${maxDayHours}h)`;
    }

    allCalendarDays.push({
      date: dateStr,
      dayOfWeek,
      dayName: dayConfig.name,
      enabled: dayConfig.enabled,
      isWeekend: dayConfig.isWeekend,
      timeSlot: timeSlotDescription,
      preferredSubject: dayConfig.defaultSubject || "Misto",
      maxHours: maxDayHours,
      standardHours: fallbackHours,
      hasCustomOverride,
      allocatedHours: 0,
      weekIndex,
      isPast,
      isToday,
      isFuture,
      dayStatus: isPast ? "pending" : "scheduled", // "completed", "skipped", "scheduled", "rest"
      topics: [],
      spacedReviews: []
    });

    curDate.setDate(curDate.getDate() + 1);
    dayOffset++;
  }

  // 3. Populate COMPLETED TOPICS & REGISTERED STUDY SESSIONS on their dates (Past + Today + Future if completed ahead)
  let pastDaysStudied = 0;
  let pastDaysSkipped = 0;
  let totalPastHours = 0;

  allCalendarDays.forEach(day => {
    // 1. Check for explicitly logged study sessions on this date
    const sessionsOnThisDay = sessions.filter(s => s.date === day.date);

    // 2. Check for topics completed on this exact date (direct checkbox / legacy)
    const completedOnThisDay = processedTopics.filter(t => t.completato && t.completedDate === day.date);

    const dayTopics = [];
    const seenTopicIds = new Set();

    // First add logged study sessions for this date
    sessionsOnThisDay.forEach(sess => {
      const topicRef = processedTopics.find(t => t.id === sess.topicId);
      seenTopicIds.add(sess.topicId);
      dayTopics.push({
        ...(topicRef || { id: sess.topicId, materia: "Studio", argomento: "Sessione di Studio", capitolo: "" }),
        effectiveHours: Number(sess.hours || 0),
        isSessionLog: true,
        sessionId: sess.id,
        sessionCompleted: Boolean(sess.completed),
        sessionNote: sess.note || "",
        assignedDate: day.date,
        assignedWeek: day.weekIndex,
        assignedDayName: day.dayName
      });
    });

    // Then add any completed topics on this date not already represented in sessions
    completedOnThisDay.forEach(t => {
      if (!seenTopicIds.has(t.id)) {
        seenTopicIds.add(t.id);
        dayTopics.push({
          ...t,
          effectiveHours: Number(t.oreEffettive || t.oreStimate || 0),
          assignedDate: day.date,
          assignedWeek: day.weekIndex,
          assignedDayName: day.dayName
        });
      }
    });

    if (dayTopics.length > 0) {
      if (day.isPast || day.isToday) {
        day.dayStatus = "completed";
      }
      day.topics = dayTopics;
      day.allocatedHours = Number(dayTopics.reduce((acc, t) => acc + (Number(t.effectiveHours || 0)), 0).toFixed(1));
      if (day.isPast || day.isToday) {
        pastDaysStudied++;
        totalPastHours += day.allocatedHours;
      }
    } else if (day.isPast) {
      if (day.enabled) {
        day.dayStatus = "skipped"; // Missed study day
        pastDaysSkipped++;
      } else {
        day.dayStatus = "rest";
      }
    }
  });

  // 4. Sequential queues for ACTIVE & FUTURE study (Starting from Today)
  // Strictly respects the pedagogical sequence: A-01, A-02, ... and G-01, G-02, ...
  const analisiQueue = uncompletedToSchedule
    .filter(t => t.materia.toLowerCase().includes("analisi"))
    .sort(sortBySequentialId);

  const geometriaQueue = uncompletedToSchedule
    .filter(t => t.materia.toLowerCase().includes("geometria"))
    .sort(sortBySequentialId);

  // Active / Future days where new study can be allocated (Today + Future)
  const activeAndFutureDays = allCalendarDays.filter(d => (d.isToday || d.isFuture) && d.enabled);

  activeAndFutureDays.forEach(day => {
    let capacityLeft = Math.max(0, Number((day.maxHours - day.allocatedHours).toFixed(2)));

    // An empty day always gets at least one topic (if queue has topics).
    // A day that already has topics/sessions only gets an extra topic if there is at least 1.0h of capacity left AND it hasn't reached maxHours.
    while (
      (day.topics.length === 0 && capacityLeft > 0.4) ||
      (day.topics.length > 0 && capacityLeft >= 1.0 && day.allocatedHours < day.maxHours)
    ) {
      let chosenTopic = null;
      let chosenQueue = null;

      // Select subject queue based on day preference or availability
      if (day.preferredSubject === "Analisi 1") {
        if (analisiQueue.length > 0) {
          chosenTopic = analisiQueue[0];
          chosenQueue = analisiQueue;
        } else if (geometriaQueue.length > 0) {
          chosenTopic = geometriaQueue[0];
          chosenQueue = geometriaQueue;
        }
      } else if (day.preferredSubject === "Geometria") {
        if (geometriaQueue.length > 0) {
          chosenTopic = geometriaQueue[0];
          chosenQueue = geometriaQueue;
        } else if (analisiQueue.length > 0) {
          chosenTopic = analisiQueue[0];
          chosenQueue = analisiQueue;
        }
      } else {
        // Misto (e.g. Weekend slots): alternate subjects sequentially
        if (day.topics.length % 2 === 0) {
          if (analisiQueue.length > 0) {
            chosenTopic = analisiQueue[0];
            chosenQueue = analisiQueue;
          } else if (geometriaQueue.length > 0) {
            chosenTopic = geometriaQueue[0];
            chosenQueue = geometriaQueue;
          }
        } else {
          if (geometriaQueue.length > 0) {
            chosenTopic = geometriaQueue[0];
            chosenQueue = geometriaQueue;
          } else if (analisiQueue.length > 0) {
            chosenTopic = analisiQueue[0];
            chosenQueue = analisiQueue;
          }
        }
      }

      if (!chosenTopic) break; // All uncompleted topics have been allocated

      // Allocate topic sequentially
      chosenQueue.shift(); // Remove from queue
      chosenTopic.assignedDate = day.date;
      chosenTopic.assignedWeek = day.weekIndex;
      chosenTopic.assignedDayName = day.dayName;

      day.topics.push(chosenTopic);
      day.allocatedHours = Number((day.allocatedHours + chosenTopic.effectiveHours).toFixed(2));
      capacityLeft = Number((capacityLeft - chosenTopic.effectiveHours).toFixed(2));
    }
  });

  // Handle any remaining unallocated topics if calendar was completely filled
  const unallocated = [...analisiQueue, ...geometriaQueue];
  if (unallocated.length > 0 && activeAndFutureDays.length > 0) {
    unallocated.forEach((topic, idx) => {
      const targetDay = activeAndFutureDays[activeAndFutureDays.length - 1 - (idx % Math.min(7, activeAndFutureDays.length))];
      topic.assignedDate = targetDay.date;
      topic.assignedWeek = targetDay.weekIndex;
      topic.assignedDayName = targetDay.dayName;
      targetDay.topics.push(topic);
      targetDay.allocatedHours = Number((targetDay.allocatedHours + topic.effectiveHours).toFixed(2));
    });
  }

  // 4b. Spaced Repetition Cyclical Reviews Calculation (+3d, +7d, +21d)
  const allSpacedReviews = [];
  processedTopics.forEach(t => {
    const isDone = Boolean(t.completato !== undefined ? t.completato : t.isCompleted);
    if (isDone && t.completedDate) {
      const srState = t.spacedReviews || {};
      const intervals = [
        { level: 1, label: "R1 (+3gg)", days: 3, key: "r1" },
        { level: 2, label: "R2 (+7gg)", days: 7, key: "r2" },
        { level: 3, label: "R3 (+21gg)", days: 21, key: "r3" }
      ];
      intervals.forEach(inv => {
        const targetDate = addDaysToDateStr(t.completedDate, inv.days);
        const isCompletedReview = Boolean(srState[inv.key]);
        const isOverdue = !isCompletedReview && targetDate < settings.currentSimulatedDate;
        const isDueToday = !isCompletedReview && targetDate === settings.currentSimulatedDate;
        allSpacedReviews.push({
          topicId: t.id,
          materia: t.materia,
          capitolo: t.capitolo || "",
          argomento: t.argomento,
          level: inv.level,
          levelKey: inv.key,
          levelLabel: inv.label,
          targetDate,
          isDone: isCompletedReview,
          isOverdue,
          isDueToday
        });
      });
    }
  });

  // Attach spacedReviews to calendar days
  allCalendarDays.forEach(day => {
    if (day.isToday) {
      day.spacedReviews = allSpacedReviews.filter(r => r.targetDate === day.date || (r.isOverdue && !r.isDone));
    } else {
      day.spacedReviews = allSpacedReviews.filter(r => r.targetDate === day.date);
    }
  });

  // 5. Group into Weekly Plans (including past, current, and future weeks)
  const weeksMap = new Map();
  allCalendarDays.forEach(day => {
    if (!weeksMap.has(day.weekIndex)) {
      weeksMap.set(day.weekIndex, {
        weekNumber: day.weekIndex,
        startDate: day.date,
        endDate: day.date,
        days: [],
        totalAllocatedHours: 0,
        totalTopicsCount: 0,
        topics: [],
        hasToday: false,
        isPastWeek: false,
        isCurrentWeek: false,
        isOverloaded: false
      });
    }

    const week = weeksMap.get(day.weekIndex);
    week.endDate = day.date;
    week.days.push(day);
    week.totalAllocatedHours = Number((week.totalAllocatedHours + day.allocatedHours).toFixed(1));
    week.topics.push(...day.topics);
    week.totalTopicsCount = week.topics.length;
    if (day.isToday) {
      week.hasToday = true;
      week.isCurrentWeek = true;
    }
    week.isOverloaded = week.totalAllocatedHours > settings.criticalWeeklyHoursThreshold;
  });

  const weeklyPlans = Array.from(weeksMap.values()).map(w => {
    const allDaysPast = w.days.every(d => d.isPast);
    return {
      ...w,
      isPastWeek: allDaysPast && !w.hasToday
    };
  });

  // Identify current week: the week containing Today (or week 1 as fallback)
  const currentWeekPlan = weeklyPlans.find(w => w.hasToday) || weeklyPlans[0] || null;

  // 6. Detailed History Timeline
  const historyDays = allCalendarDays
    .filter(d => d.isPast || d.isToday)
    .sort((a, b) => b.date.localeCompare(a.date)); // Most recent first

  return {
    metrics: {
      remainingDays,
      remainingWeeks,
      totalRemainingBaseHours,
      totalRemainingEffectiveHours,
      totalBufferHours,
      requiredWeeklyHours,
      criticalWeeklyHoursThreshold: dynamicCriticalThreshold,
      nominalWeeklyCapacity,
      standardWeekdayHours,
      standardWeekendHours,
      effectiveWeekdayHours: standardWeekdayHours,
      effectiveWeekendHours: standardWeekendHours,
      hasCustomOverrides: Object.keys(dayCapacities).length > 0,
      customOverridesCount: Object.keys(dayCapacities).length,
      customDayCapacities: dayCapacities,
      eveningStudyHours: standardWeekdayHours,
      isCriticalOverload,
      excessHours: Number(Math.max(0, requiredWeeklyHours - dynamicCriticalThreshold).toFixed(1)),
      uncompletedCount: uncompletedToSchedule.length,
      totalEffectiveHours: Number(topics.reduce((acc, t) => acc + (Number(t.oreEffettive || (t.isCompleted || t.completato ? t.oreStimate : 0))), 0).toFixed(1)),
      targetExamDate: settings.targetExamDate,
      currentSimulatedDate: settings.currentSimulatedDate,
      roadmapStartDate: settings.roadmapStartDate,
      // Historical stats
      pastDaysStudied,
      pastDaysSkipped,
      totalPastHours: Number(totalPastHours.toFixed(1)),
      historyCount: historyDays.length,
      // Spaced Repetition stats
      spacedRepetition: {
        dueToday: allSpacedReviews.filter(r => r.isDueToday).length,
        overdue: allSpacedReviews.filter(r => r.isOverdue).length,
        completed: allSpacedReviews.filter(r => r.isDone).length,
        totalPlanned: allSpacedReviews.length,
        activeReviews: allSpacedReviews.filter(r => !r.isDone && (r.isDueToday || r.isOverdue))
      },
      // Heuristic Exam Readiness & Expected Grade
      examPrediction: calculateExamReadinessAndGrade(topics, {
        pastDaysStudied,
        pastDaysSkipped,
        requiredWeeklyHours,
        criticalWeeklyHoursThreshold: dynamicCriticalThreshold
      })
    },
    weeklyPlans,
    currentWeekPlan,
    calendarDays: allCalendarDays,
    historyDays,
    studySessions: sessions,
    progress: calculateSubjectProgress(topics)
  };
}
