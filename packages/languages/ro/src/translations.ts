// In Romanian, numbers ending in 00 or in 20 to 99 take "de" before the noun:
// "15 secunde" but "25 de secunde", "101 ani" but "120 de ani".
const withDe = (unit: string) => (value: number) => {
  const lastTwoDigits = value % 100
  if (value !== 0 && (lastTwoDigits === 0 || lastTwoDigits >= 20)) {
    return `${value} de ${unit}`
  }
  return `${value} ${unit}`
}

export default {
  warnings: {
    straightRow: 'Tastele consecutive de pe tastatură sunt ușor de ghicit.',
    keyPattern: 'Combinațiile scurte de taste sunt ușor de ghicit.',
    simpleRepeat: 'Caracterele repetate, cum ar fi "aaa", sunt ușor de ghicit.',
    extendedRepeat: 'Modele repetate precum "abcabcabc" sunt ușor de ghicit.',
    sequences:
      'Secvențele de caractere comune precum "abc" sunt ușor de ghicit.',
    recentYears: 'Anii recenți sunt ușor de ghicit.',
    dates: 'Datele calendaristice sunt ușor de ghicit.',
    topTen: 'Este una dintre cele mai frecvent utilizate parole.',
    topHundred: 'Este o parolă utilizată frecvent.',
    common: 'Este o parolă folosită frecvent.',
    similarToCommon: 'Este similară cu o parolă folosită frecvent.',
    wordByItself: 'Cuvintele simple sunt ușor de ghicit.',
    namesByThemselves: 'Numele și prenumele singure sunt ușor de ghicit.',
    commonNames: 'Numele și prenumele comune sunt ușor de ghicit.',
    userInputs:
      'Pe această pagină nu ar trebui să existe date personale sau conexe.',
    pwned:
      'Parola ta a fost expusă de o încălcare a securității datelor pe internet.',
  },
  suggestions: {
    l33t: 'Evită substituțiile previzibile, cum ar fi "@" pentru "a".',
    reverseWords: 'Evită cuvintele comune scrise invers.',
    allUppercase: 'Scrie cu majuscule unele litere, dar nu toate literele.',
    capitalization:
      'Scrie cu majusculă unele litere în plus față de prima literă.',
    dates: 'Evită datele calendaristice care îți sunt asociate.',
    recentYears: 'Evită anii recenți.',
    associatedYears: 'Evită anii asociați cu tine.',
    sequences: 'Evită secvențele comune de litere.',
    repeated: 'Evită cuvintele și literele care se repetă.',
    longerKeyboardPattern:
      'Folosește înlănțuiri de caractere mai lungi și schimbă direcția de tastare de mai multe ori.',
    anotherWord: 'Adaugă mai multe cuvinte care sunt mai puțin comune.',
    useWords: 'Folosește mai multe cuvinte, dar evită frazele comune.',
    noNeed:
      'Poți crea parole puternice fără să folosești simboluri, numere sau majuscule.',
    pwned:
      'Dacă folosești această parolă în altă parte, ar trebui să o schimbi.',
  },
  timeEstimation: {
    ltSecond: 'mai puțin de o secundă',
    second: '{base} secundă',
    seconds: withDe('secunde'),
    minute: '{base} minut',
    minutes: withDe('minute'),
    hour: '{base} oră',
    hours: withDe('ore'),
    day: '{base} zi',
    days: withDe('zile'),
    month: '{base} lună',
    months: withDe('luni'),
    year: '{base} an',
    years: withDe('ani'),
    centuries: 'secole',
  },
}
