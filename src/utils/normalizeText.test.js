import { describe, it, expect } from 'vitest';
import { normalizeText } from './normalizeText';

describe('normalizeText', () => {
    it('lowercases the input', () => {
        expect(normalizeText('IPHONE')).toBe('iphone');
    });

    it('trims leading and trailing whitespace', () => {
        expect(normalizeText('  iphone  ')).toBe('iphone');
    });

    it('removes diacritics/accents', () => {
        expect(normalizeText('Móvil Ñandú')).toBe('movil nandu');
    });

    it('returns an empty string for an empty input', () => {
        expect(normalizeText('')).toBe('');
    });
});
