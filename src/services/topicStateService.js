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

/**
 * Annulla una sessione cancellata.
 * - Le ore della sessione vengono sottratte.
 * - Il completamento viene tolto SOLO se era stato prodotto da questa sessione
 *   (sessione "completed" nella stessa data di completamento) e nessun'altra
 *   sessione completata lo giustifica. Un argomento spuntato a mano resta completato.
 */
export function revertSessionFromTopic(topic, session, otherSessions = []) {
  const currentEff = Number(topic.oreEffettive || 0);
  const revertedEff = Math.max(0, Number((currentEff - Number(session.hours || 0)).toFixed(2)));
  const wasDone = isTopicDone(topic);

  const otherCompleted = otherSessions
    .filter(s => s.id !== session.id && s.topicId === session.topicId && s.completed)
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));

  const completionCameFromThisSession = Boolean(session.completed) &&
    (!topic.completedDate || topic.completedDate === session.date);

  let stillDone = wasDone;
  let completedDate = topic.completedDate || null;
  if (wasDone && completionCameFromThisSession) {
    stillDone = otherCompleted.length > 0;
    completedDate = stillDone ? otherCompleted[0].date : null;
  }

  return {
    ...topic,
    oreEffettive: revertedEff,
    completato: stillDone,
    isCompleted: stillDone,
    completedDate: stillDone ? completedDate : null
  };
}

/**
 * Imposta lo stato di completamento scrivendo SEMPRE entrambi i campi
 * (`completato` è quello letto dal motore, `isCompleted` è il campo legacy):
 * scriverne uno solo lasciava l'altro in contrasto e la modifica non aveva effetto.
 */
export function withCompletion(topic, done, date = null) {
  const isDone = Boolean(done);
  return {
    ...topic,
    completato: isDone,
    isCompleted: isDone,
    completedDate: isDone ? (topic.completedDate || date || null) : null
  };
}

/**
 * Migrazione dati: le versioni precedenti salvavano gli appunti personali anche in
 * `note`, cancellando il focus didattico ufficiale. Se `note` coincide con gli appunti,
 * si ripristina il testo ufficiale dal dataset predefinito.
 */
export function restoreOfficialNotes(topics, defaultTopics) {
  const officialById = new Map((defaultTopics || []).map(t => [t.id, t.note]));
  return (topics || []).map(t => {
    const official = officialById.get(t.id);
    if (t.scratchpadNotes && t.note === t.scratchpadNotes && official !== undefined && official !== t.note) {
      return { ...t, note: official };
    }
    return t;
  });
}
