export function createZodErrorMap(t) {
  return (issue, context) => {
    if (issue.code === 'invalid_format' && issue.format === 'email') {
      return { message: t('validation.invalidEmail') }
    }
    if (
      issue.code === 'too_small' &&
      issue.minimum &&
      issue.origin === 'string'
    ) {
      return {
        message: t('validation.minCharacters', { count: issue.minimum }),
      }
    }
    if (issue.code === 'invalid_type') {
      return { message: t('validation.required') }
    }
    return { message: context.defaultError }
  }
}
