import { INITIAL_TOPICS } from '../src/data/defaultData.js';
import { rebalanceStudyPlan, DEFAULT_SETTINGS } from '../src/services/rebalancerEngine.js';

const plan = rebalanceStudyPlan(INITIAL_TOPICS, DEFAULT_SETTINGS);

console.log("Total weekly plans: " + plan.weeklyPlans.length);
plan.weeklyPlans.forEach(w => {
  console.log("=== SETTIMANA " + w.weekNumber + " (" + w.startDate + " - " + w.endDate + "): " + w.topics.length + " topics, " + w.totalAllocatedHours + "h ===");
  w.topics.forEach(t => {
    console.log("   [" + t.id + "] (" + t.materia + ") " + t.argomento.substring(0, 45) + "... (" + t.effectiveHours + "h)");
  });
});
