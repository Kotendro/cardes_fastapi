export function upsertCard(state, card) {
  const id = card.id

  const nextDetailById = { ...state.detailById }
  nextDetailById[id] = { ...(nextDetailById[id] ?? {}), ...card }

  const nextShortById = { ...state.shortById }
  nextShortById[id] = { ...(nextShortById[id] ?? {}), ...pickShort(card) }

  return {
    ...state,
    shortById: nextShortById,
    detailById: nextDetailById,
  }
}

function pickShort(card) {
  const {
    id,
    title,
    completed,
    difficulty,
    tags,
    updated_at,
  } = card

  return {
    id,
    title,
    completed,
    difficulty,
    tags,
    updated_at,
  }
}