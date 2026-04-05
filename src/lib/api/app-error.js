export function normalizeApiError(error) {
  if (!error) {
    return createBaseError()
  }

  if (error.response) {
    const { data, status } = error.response
    return {
      ...createBaseError(),
      status,
      code: data?.code ?? `HTTP_${status}`,
      message:
        data?.message ??
        (status === 401
          ? 'validation.sessionExpired'
          : status === 403
            ? 'validation.forbidden'
            : status === 422
              ? 'validation.invalidSubmission'
              : 'validation.unexpectedError'),
      fields: data?.errors ?? {},
      isAuthError: status === 401 || status === 403,
      raw: error,
    }
  }

  if (error.request) {
    return {
      ...createBaseError(),
      code: 'NETWORK_ERROR',
      message: 'validation.networkError',
      isNetworkError: true,
      raw: error,
    }
  }

  return {
    ...createBaseError(),
    code: error.code ?? 'UNKNOWN_ERROR',
    message: error.message ?? 'validation.unexpectedError',
    raw: error,
  }
}

function createBaseError() {
  return {
    status: null,
    code: 'UNKNOWN_ERROR',
    message: 'validation.unexpectedError',
    fields: {},
    isAuthError: false,
    isNetworkError: false,
    raw: null,
  }
}
