export function createObjectUrlSafe(file) {
  if (
    typeof Blob === 'undefined' ||
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function' ||
    !(file instanceof Blob)
  ) {
    return ''
  }

  try {
    return URL.createObjectURL(file)
  } catch {
    return ''
  }
}

export function revokeObjectUrlSafe(url) {
  if (
    !url ||
    typeof URL === 'undefined' ||
    typeof URL.revokeObjectURL !== 'function'
  ) {
    return
  }

  try {
    URL.revokeObjectURL(url)
  } catch {
    // No-op
  }
}
