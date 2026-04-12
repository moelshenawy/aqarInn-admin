export function getLocalizedAuthErrorMessage(error, t) {
  const fieldMessage = getFirstFieldMessage(error?.fields)
  const messageKey =
    fieldMessage || error?.message || 'validation.unexpectedError'

  if (typeof messageKey !== 'string') {
    return t('unexpectedError', { ns: 'validation' })
  }

  if (messageKey.includes('.')) {
    const [ns, key] = messageKey.split('.', 2)
    return t(key, { ns })
  }

  const authTranslation = t(messageKey)
  if (authTranslation !== messageKey) {
    return authTranslation
  }

  const validationTranslation = t(messageKey, { ns: 'validation' })
  if (validationTranslation !== messageKey) {
    return validationTranslation
  }

  return messageKey
}

function getFirstFieldMessage(fields) {
  if (!fields || typeof fields !== 'object') {
    return null
  }

  const firstValue = Object.values(fields)[0]

  if (Array.isArray(firstValue)) {
    return typeof firstValue[0] === 'string' ? firstValue[0] : null
  }

  return typeof firstValue === 'string' ? firstValue : null
}
