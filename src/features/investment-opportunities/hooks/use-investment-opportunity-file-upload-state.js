import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_MANAGED_FILES = {
  propertyDocuments: [],
  propertyImages: [],
  virtualTour: [],
  developerLogo: [],
}

const MULTI_UPLOAD_FIELDS = new Set(['propertyDocuments', 'propertyImages'])

function normalizeFiles(value) {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (typeof FileList !== 'undefined' && value instanceof FileList) {
    return Array.from(value)
  }

  return []
}

function getFileExtension(fileName) {
  const normalizedName = String(fileName ?? '').trim()
  const extension = normalizedName.split('.').pop()?.trim().toLowerCase()

  if (!extension || extension === normalizedName.toLowerCase()) {
    return 'file'
  }

  return extension
}

function getPreviewKind(file) {
  const mimeType = String(file?.type ?? '').toLowerCase()

  if (mimeType.startsWith('image/')) {
    return 'image'
  }

  if (mimeType === 'application/pdf') {
    return 'pdf'
  }

  return 'unsupported'
}

function toPreviewItem(file, index) {
  return {
    index,
    file,
    name: file?.name ?? '',
    extension: getFileExtension(file?.name),
    previewKind: getPreviewKind(file),
  }
}

function buildInitialManagedFiles(initialManagedFiles = {}) {
  return {
    propertyDocuments: normalizeFiles(
      initialManagedFiles.propertyDocuments ?? DEFAULT_MANAGED_FILES.propertyDocuments,
    ),
    propertyImages: normalizeFiles(
      initialManagedFiles.propertyImages ?? DEFAULT_MANAGED_FILES.propertyImages,
    ),
    virtualTour: normalizeFiles(
      initialManagedFiles.virtualTour ?? DEFAULT_MANAGED_FILES.virtualTour,
    ),
    developerLogo: normalizeFiles(
      initialManagedFiles.developerLogo ?? DEFAULT_MANAGED_FILES.developerLogo,
    ),
  }
}

export function useInvestmentOpportunityFileUploadState({
  register,
  setValue,
  clearErrors,
  initialManagedFiles,
}) {
  const initialState = useMemo(
    () => buildInitialManagedFiles(initialManagedFiles),
    [initialManagedFiles],
  )
  const [managedFiles, setManagedFiles] = useState(initialState)
  const managedFilesRef = useRef(initialState)
  const [uploadingFields, setUploadingFields] = useState({})
  const [propertyImagePreviewUrls, setPropertyImagePreviewUrls] = useState([])
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false)
  const [isDocumentPreviewOpen, setIsDocumentPreviewOpen] = useState(false)
  const [selectedDocumentPreviewIndex, setSelectedDocumentPreviewIndex] =
    useState(null)

  const uploadTimeoutsRef = useRef({})
  const fileInputRefs = useRef({})

  useEffect(() => {
    managedFilesRef.current = managedFiles
  }, [managedFiles])

  useEffect(() => {
    const imageFiles = normalizeFiles(managedFiles.propertyImages)

    if (!imageFiles.length) {
      setPropertyImagePreviewUrls([])
      return
    }

    const nextPreviewUrls = imageFiles.map((file) => URL.createObjectURL(file))
    setPropertyImagePreviewUrls(nextPreviewUrls)

    return () => {
      nextPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [managedFiles.propertyImages])

  useEffect(
    () => () => {
      Object.values(uploadTimeoutsRef.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId)
      })
    },
    [],
  )

  useEffect(() => {
    const documentsFiles = normalizeFiles(managedFiles.propertyDocuments)

    if (!documentsFiles.length) {
      setIsDocumentsModalOpen(false)
      setIsDocumentPreviewOpen(false)
      setSelectedDocumentPreviewIndex(null)
      return
    }

    if (
      selectedDocumentPreviewIndex !== null &&
      !documentsFiles[selectedDocumentPreviewIndex]
    ) {
      setIsDocumentPreviewOpen(false)
      setSelectedDocumentPreviewIndex(null)
    }
  }, [managedFiles.propertyDocuments, selectedDocumentPreviewIndex])

  const updateManagedFilesForField = useCallback(
    (fieldName, files, { append = false } = {}) => {
      const normalizedIncomingFiles = normalizeFiles(files)
      const currentManagedFiles = managedFilesRef.current
      const currentFieldFiles = normalizeFiles(currentManagedFiles[fieldName])
      const shouldAppend = append && MULTI_UPLOAD_FIELDS.has(fieldName)
      const nextFieldFiles = MULTI_UPLOAD_FIELDS.has(fieldName)
        ? shouldAppend
          ? [...currentFieldFiles, ...normalizedIncomingFiles]
          : normalizedIncomingFiles
        : normalizedIncomingFiles.slice(0, 1)

      const nextManagedFiles = {
        ...currentManagedFiles,
        [fieldName]: nextFieldFiles,
      }

      managedFilesRef.current = nextManagedFiles
      setManagedFiles(nextManagedFiles)
      setValue(fieldName, nextFieldFiles, {
        shouldDirty: true,
        shouldValidate: true,
      })
      clearErrors(fieldName)

      return nextFieldFiles
    },
    [clearErrors, setValue],
  )

  const setFieldUploading = useCallback((fieldName) => {
    window.clearTimeout(uploadTimeoutsRef.current[fieldName])

    setUploadingFields((current) => ({ ...current, [fieldName]: true }))
    uploadTimeoutsRef.current[fieldName] = window.setTimeout(() => {
      setUploadingFields((current) => ({ ...current, [fieldName]: false }))
    }, 450)
  }, [])

  const triggerUploadForField = useCallback((fieldName) => {
    fileInputRefs.current[fieldName]?.click()
  }, [])

  const registerFileField = useCallback(
    (fieldName) => {
      const field = register(fieldName)

      return {
        ...field,
        ref: (element) => {
          field.ref(element)
          fileInputRefs.current[fieldName] = element
        },
        onChange: (event) => {
          const nextFiles = normalizeFiles(event.target.files)
          if (!nextFiles.length) {
            return
          }

          setFieldUploading(fieldName)
          updateManagedFilesForField(fieldName, nextFiles, {
            append: MULTI_UPLOAD_FIELDS.has(fieldName),
          })

          event.target.value = ''
        },
      }
    },
    [register, setFieldUploading, updateManagedFilesForField],
  )

  const removeSelectedFile = useCallback(
    (fieldName, index) => {
      const currentFiles = normalizeFiles(managedFilesRef.current[fieldName])
      const nextFiles = currentFiles.filter(
        (_, fileIndex) => fileIndex !== Number(index),
      )

      updateManagedFilesForField(fieldName, nextFiles)

      if (fileInputRefs.current[fieldName]) {
        fileInputRefs.current[fieldName].value = ''
      }

      if (fieldName === 'propertyDocuments') {
        setSelectedDocumentPreviewIndex((currentIndex) => {
          if (currentIndex === null) {
            return null
          }

          if (currentIndex === index) {
            return null
          }

          if (currentIndex > index) {
            return currentIndex - 1
          }

          return currentIndex
        })
      }
    },
    [updateManagedFilesForField],
  )

  const openDocumentsFilesModal = useCallback(() => {
    if (!normalizeFiles(managedFilesRef.current.propertyDocuments).length) {
      return
    }

    setIsDocumentPreviewOpen(false)
    setIsDocumentsModalOpen(true)
  }, [])

  const closeDocumentsFilesModal = useCallback(() => {
    setIsDocumentsModalOpen(false)
  }, [])

  const openDocumentPreview = useCallback((previewTarget) => {
    const nextIndex =
      typeof previewTarget === 'number'
        ? previewTarget
        : Number(previewTarget?.index)

    if (
      Number.isNaN(nextIndex) ||
      !normalizeFiles(managedFilesRef.current.propertyDocuments)[nextIndex]
    ) {
      return
    }

    setSelectedDocumentPreviewIndex(nextIndex)
    setIsDocumentsModalOpen(false)
    setIsDocumentPreviewOpen(true)
  }, [])

  const closeDocumentPreview = useCallback(() => {
    setIsDocumentPreviewOpen(false)
  }, [])

  const backToDocumentsFilesModal = useCallback(() => {
    if (!normalizeFiles(managedFilesRef.current.propertyDocuments).length) {
      setIsDocumentPreviewOpen(false)
      return
    }

    setIsDocumentPreviewOpen(false)
    setIsDocumentsModalOpen(true)
  }, [])

  const documentPreviewItems = useMemo(
    () =>
      normalizeFiles(managedFiles.propertyDocuments).map((file, index) =>
        toPreviewItem(file, index),
      ),
    [managedFiles.propertyDocuments],
  )

  const selectedDocumentPreviewItem = useMemo(() => {
    if (selectedDocumentPreviewIndex === null) {
      return null
    }

    const selectedFile = normalizeFiles(managedFiles.propertyDocuments)[
      selectedDocumentPreviewIndex
    ]

    if (!selectedFile) {
      return null
    }

    return toPreviewItem(selectedFile, selectedDocumentPreviewIndex)
  }, [managedFiles.propertyDocuments, selectedDocumentPreviewIndex])

  const fileFields = useMemo(
    () => ({
      propertyDocuments: registerFileField('propertyDocuments'),
      propertyImages: registerFileField('propertyImages'),
      virtualTour: registerFileField('virtualTour'),
      developerLogo: registerFileField('developerLogo'),
    }),
    [registerFileField],
  )

  const fileUploadState = useMemo(
    () => ({
      propertyDocuments: {
        files: managedFiles.propertyDocuments,
        previewItems: documentPreviewItems,
        selectedPreviewItem: selectedDocumentPreviewItem,
        isFilesModalOpen: isDocumentsModalOpen,
        isPreviewModalOpen: isDocumentPreviewOpen,
        isLoading: Boolean(uploadingFields.propertyDocuments),
        onRemoveFile: (index) => removeSelectedFile('propertyDocuments', index),
        onOpenFilesModal: openDocumentsFilesModal,
        onCloseFilesModal: closeDocumentsFilesModal,
        onOpenFilePreview: openDocumentPreview,
        onClosePreviewModal: closeDocumentPreview,
        onBackToFilesModal: backToDocumentsFilesModal,
        onUploadMore: () => triggerUploadForField('propertyDocuments'),
      },
      propertyImages: {
        files: managedFiles.propertyImages,
        imagePreviewUrls: propertyImagePreviewUrls,
        isLoading: Boolean(uploadingFields.propertyImages),
        onRemoveFile: (index) => removeSelectedFile('propertyImages', index),
      },
      virtualTour: {
        files: managedFiles.virtualTour,
        isLoading: Boolean(uploadingFields.virtualTour),
        onRemoveFile: (index) => removeSelectedFile('virtualTour', index),
      },
      developerLogo: {
        files: managedFiles.developerLogo,
        isLoading: Boolean(uploadingFields.developerLogo),
        onRemoveFile: (index) => removeSelectedFile('developerLogo', index),
      },
    }),
    [
      backToDocumentsFilesModal,
      closeDocumentPreview,
      closeDocumentsFilesModal,
      documentPreviewItems,
      isDocumentPreviewOpen,
      isDocumentsModalOpen,
      managedFiles.developerLogo,
      managedFiles.propertyDocuments,
      managedFiles.propertyImages,
      managedFiles.virtualTour,
      openDocumentPreview,
      openDocumentsFilesModal,
      propertyImagePreviewUrls,
      removeSelectedFile,
      selectedDocumentPreviewItem,
      triggerUploadForField,
      uploadingFields.developerLogo,
      uploadingFields.propertyDocuments,
      uploadingFields.propertyImages,
      uploadingFields.virtualTour,
    ],
  )

  return {
    fileFields,
    fileUploadState,
    managedFiles,
    setManagedFilesForField: updateManagedFilesForField,
    triggerUploadForField,
  }
}

