import {
  formatUptime,
  formatTimestamp,
  getAnomalyTypeColor,
  debounce,
  generateAnomalyId,
  validateCameraConstraints,
  getCameraErrorMessage
} from '../src/utils';

describe('formatUptime', () => {
  test('formaterer minutter riktig', () => {
    expect(formatUptime(30)).toBe('30 min');
    expect(formatUptime(59)).toBe('59 min');
  });

  test('formaterer timer riktig', () => {
    expect(formatUptime(60)).toBe('1t 0m');
    expect(formatUptime(90)).toBe('1t 30m');
    expect(formatUptime(120)).toBe('2t 0m');
  });

  test('formaterer dager riktig', () => {
    expect(formatUptime(1440)).toBe('1d 0t 0m');
    expect(formatUptime(1500)).toBe('1d 1t 0m');
    expect(formatUptime(2880)).toBe('2d 0t 0m');
  });

  test('håndterer ugyldig input', () => {
    expect(formatUptime(-5)).toBe('0 min');
    expect(formatUptime('invalid')).toBe('0 min');
  });
});

describe('formatTimestamp', () => {
  test('formaterer gyldig timestamp', () => {
    const result = formatTimestamp('2025-06-28T20:15:00.000Z');
    expect(result).toMatch(/\d{1,2}\.\d{1,2}\.\d{4}/); // Norwegian date format
  });

  test('returnerer "Ingen" for null/undefined', () => {
    expect(formatTimestamp(null)).toBe('Ingen');
    expect(formatTimestamp(undefined)).toBe('Ingen');
    expect(formatTimestamp('')).toBe('Ingen');
  });

  test('returnerer original verdi for ugyldig timestamp', () => {
    expect(formatTimestamp('invalid-date')).toBe('invalid-date');
  });
});

describe('getAnomalyTypeColor', () => {
  test('returnerer riktig farge for sikkerhet', () => {
    expect(getAnomalyTypeColor('sikkerhet')).toBe('text-red-400');
    expect(getAnomalyTypeColor('Security')).toBe('text-red-400');
  });

  test('returnerer riktig farge for system', () => {
    expect(getAnomalyTypeColor('system')).toBe('text-blue-400');
    expect(getAnomalyTypeColor('System')).toBe('text-blue-400');
  });

  test('returnerer riktig farge for advarsel', () => {
    expect(getAnomalyTypeColor('advarsel')).toBe('text-yellow-400');
    expect(getAnomalyTypeColor('Warning')).toBe('text-yellow-400');
  });

  test('returnerer default farge for ukjent type', () => {
    expect(getAnomalyTypeColor('unknown')).toBe('text-gray-400');
    expect(getAnomalyTypeColor('')).toBe('text-gray-400');
    expect(getAnomalyTypeColor(null)).toBe('text-gray-400');
  });
});

describe('debounce', () => {
  jest.useFakeTimers();

  test('forsinker funksjonsutførelse', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('kansellerer tidligere kall', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});

describe('generateAnomalyId', () => {
  test('genererer unik ID', () => {
    const id1 = generateAnomalyId();
    const id2 = generateAnomalyId();
    
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(id1.length).toBeGreaterThan(10);
  });
});

describe('validateCameraConstraints', () => {
  test('returnerer default constraints når ingen gis', () => {
    const result = validateCameraConstraints();
    expect(result.video.width.ideal).toBe(640);
    expect(result.video.height.ideal).toBe(480);
    expect(result.video.facingMode).toBe("user");
  });

  test('overskriver med custom constraints', () => {
    const custom = { video: { width: { ideal: 1920 } } };
    const result = validateCameraConstraints(custom);
    expect(result.video.width.ideal).toBe(1920);
    expect(result.video.height.ideal).toBe(480); // Should keep default
  });
});

describe('getCameraErrorMessage', () => {
  test('returnerer riktig melding for kjente feil', () => {
    expect(getCameraErrorMessage({ name: 'NotFoundError' })).toBe('Ingen kamera funnet');
    expect(getCameraErrorMessage({ name: 'NotAllowedError' })).toBe('Kameratilgang nektet');
    expect(getCameraErrorMessage({ name: 'NotReadableError' })).toBe('Kamera er i bruk av annen app');
  });

  test('returnerer default melding for ukjente feil', () => {
    expect(getCameraErrorMessage({ name: 'UnknownError' })).toBe('Kunne ikke starte kamera');
    expect(getCameraErrorMessage({})).toBe('Kunne ikke starte kamera');
    expect(getCameraErrorMessage(null)).toBe('Ukjent feil');
  });
});