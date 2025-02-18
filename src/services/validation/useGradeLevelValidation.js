import { ref } from 'vue'

const MIN_NAME_LENGTH = 6 // Minimum length for grade level names

// Original input format detection
const detectInputFormat = (name) => {
  const lowered = name.toLowerCase()
  
  // Grade formats
  if (lowered.includes('grade')) {
    if (/grade\s*\d+/.test(lowered)) return 'grade-number' // Grade 1
    if (/grade\s*(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)/.test(lowered)) return 'grade-word' // Grade One
  }
  
  // Year formats
  if (lowered.includes('year')) {
    if (/\d+(?:st|nd|rd|th)\s*year/.test(lowered)) return 'year-ordinal' // 1st Year
    if (/(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)\s*year/.test(lowered)) return 'year-word' // First Year
  }
  
  return null
}

const formatToStandard = {
  'grade-number': {
    words: {
      'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8',
      'nine': '9', 'ten': '10', 'eleven': '11', 'twelve': '12'
    },
    ordinals: {
      '1st': '1', '2nd': '2', '3rd': '3', '4th': '4',
      '5th': '5', '6th': '6', '7th': '7', '8th': '8',
      '9th': '9', '10th': '10', '11th': '11', '12th': '12'
    }
  },
  'grade-word': {
    numbers: {
      '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
      '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight',
      '9': 'Nine', '10': 'Ten', '11': 'Eleven', '12': 'Twelve'
    }
  },
  'year-ordinal': {
    toOrdinal: {
      '1': '1st', '2': '2nd', '3': '3rd', '4': '4th',
      '5': '5th', '6': '6th', '7': '7th', '8': '8th',
      '9': '9th', '10': '10th', '11': '11th', '12': '12th'
    }
  },
  'year-word': {
    words: {
      '1': 'First', '2': 'Second', '3': 'Third', '4': 'Fourth',
      '5': 'Fifth', '6': 'Sixth', '7': 'Seventh', '8': 'Eighth',
      '9': 'Ninth', '10': 'Tenth', '11': 'Eleventh', '12': 'Twelfth'
    }
  }
}

const standardizeName = (name, format) => {
  let standardized = name.trim()
  const lowered = standardized.toLowerCase()

  switch (format) {
    case 'grade-number':
      // Convert "Grade One" or "Grade 1st" to "Grade 1"
      Object.entries(formatToStandard['grade-number'].words).forEach(([word, num]) => {
        standardized = standardized.replace(new RegExp(`grade\\s*${word}`, 'i'), `Grade ${num}`)
      })
      Object.entries(formatToStandard['grade-number'].ordinals).forEach(([ordinal, num]) => {
        standardized = standardized.replace(new RegExp(`grade\\s*${ordinal}`, 'i'), `Grade ${num}`)
      })
      break

    case 'grade-word':
      // Convert "Grade 1" to "Grade One"
      Object.entries(formatToStandard['grade-word'].numbers).forEach(([num, word]) => {
        standardized = standardized.replace(new RegExp(`grade\\s*${num}`, 'i'), `Grade ${word}`)
      })
      break

    case 'year-ordinal':
      // Convert "First Year" or "1 Year" to "1st Year"
      Object.entries(formatToStandard['year-ordinal'].toOrdinal).forEach(([num, ordinal]) => {
        standardized = standardized
          .replace(new RegExp(`${formatToStandard['year-word'].words[num]}\\s*year`, 'i'), `${ordinal} Year`)
          .replace(new RegExp(`${num}\\s*year`, 'i'), `${ordinal} Year`)
      })
      break

    case 'year-word':
      // Convert "1st Year" to "First Year"
      Object.entries(formatToStandard['year-word'].words).forEach(([num, word]) => {
        standardized = standardized
          .replace(new RegExp(`${formatToStandard['year-ordinal'].toOrdinal[num]}\\s*year`, 'i'), `${word} Year`)
          .replace(new RegExp(`${num}\\s*year`, 'i'), `${word} Year`)
      })
      break
  }

  // Ensure proper capitalization
  return standardized.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const formatExamples = {
  'grade-number': 'Grade 1, Grade 2',
  'grade-word': 'Grade One, Grade Two',
  'year-ordinal': '1st Year, 2nd Year',
  'year-word': 'First Year, Second Year'
}

const existingNamesRef = ref(new Set())
const formatRef = ref(null)

export function useGradeLevelValidation() {
  const errors = ref({})

  const setExistingNames = (names) => {
    existingNamesRef.value = new Set(names)
    
    // Detect format from first entry
    if (names.length > 0) {
      formatRef.value = detectInputFormat(names[0])
    }
  }

  const validateName = (name, currentName = '') => {
    errors.value = {}
    
    if (!name || name.trim() === '') {
      errors.value.name = 'Grade level name is required'
      return false
    }

    // Check minimum length
    if (name.trim().length < MIN_NAME_LENGTH) {
      errors.value.name = `Name must be at least ${MIN_NAME_LENGTH} characters long`
      return false
    }

    // Detect format of new name
    const inputFormat = detectInputFormat(name)
    if (!inputFormat) {
      errors.value.name = `Please use a valid format like: ${formatExamples['year-word']} or ${formatExamples['grade-number']}`
      return false
    }

    // If this is the first entry, set the format
    if (!formatRef.value) {
      formatRef.value = inputFormat
    }
    // Otherwise check if it matches the existing format
    else if (inputFormat !== formatRef.value) {
      errors.value.name = `Please use the format: ${formatExamples[formatRef.value]}`
      return false
    }

    // Standardize the name according to the format
    const standardizedNew = standardizeName(name, formatRef.value)
    const standardizedCurrent = currentName ? standardizeName(currentName, formatRef.value) : ''

    // Check for duplicates
    if (existingNamesRef.value.has(standardizedNew) && standardizedNew !== standardizedCurrent) {
      errors.value.name = 'This grade level name already exists'
      return false
    }

    return true
  }

  const getNormalizedName = (name) => {
    const format = formatRef.value || detectInputFormat(name)
    return format ? standardizeName(name, format) : name
  }

  const getPreferredFormat = () => formatRef.value

  return {
    errors,
    validateName,
    setExistingNames,
    getNormalizedName,
    getPreferredFormat
  }
}