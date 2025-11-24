export const LEVEL_IDS = {
    GRADE_1_CALC: 'grade-1-calc',
    GRADE_2_KUKU: 'grade-2-kuku',
    GRADE_4_GEOMETRY: 'grade-4-geometry',
} as const;

export const LEVEL_NAMES: Record<string, string> = {
    [LEVEL_IDS.GRADE_1_CALC]: '1ねんせい たしざん・ひきざん',
    [LEVEL_IDS.GRADE_2_KUKU]: '2ねんせい 九九',
    [LEVEL_IDS.GRADE_4_GEOMETRY]: '4ねんせい 図形の面積',
};
