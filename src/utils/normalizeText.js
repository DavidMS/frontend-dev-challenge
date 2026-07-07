const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

export function normalizeText(value) {
    return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(DIACRITICS_REGEX, '');
}
