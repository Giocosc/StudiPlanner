/**
 * Topic State Service
 * Regole pure (senza React) per aggiornare lo stato di un argomento quando si
 * registrano o cancellano sessioni di studio. Sono isolate qui per poterle
 * testare in Node (tests/topicState.test.mjs).
 */

/** Stato di completamento di un argomento (compatibile con i campi legacy). */
export function isTopicDone(topic) {
  if (!topic) return false;
  return Boolean(topic.completato !== undefined ? topic.completato : topic.isCompleted);
}

/**
 * Applica una nuova sessione di studio all'argomento.
 * - Le ore si sommano a oreEffettive.
 * - `completed: true` completa l'argomento.
 * - Registrare ore NON toglie mai il completamento: una sessione di ripasso su un
 *   argomento già completato lo lascia completato (per scompletare si usa la spunta).
 * - Con `completed` non specificato, l'argomento si completa quando le ore
 *   raggiungono la stima.
 */
export function applySessionToTopic(topic, { hours, completed, date }) {
  const numHours = Number(hours) || 0;
  const currentEff = Number(topic.oreEffettive || 0);
  const newEff = Number((currentEff + numHours).toFixed(2));
  const wasDone = isTopicDone(topic);
  const reachedEstimate = newEff >= Number(topic.oreStimate || 2.0);
  const isDone = completed === true || wasDone || (completed === undefined && reachedEstimate);

  return {
    ...topic,
    oreEffettive: newEff,
    completato: isDone,
    isCompleted: isDone,
    completedDate: isDone ? (topic.completedDate || date) : null
  };
}
