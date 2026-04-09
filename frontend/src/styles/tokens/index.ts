import { colorVariablesCss } from './colors';
import { typographyVariablesCss } from './typography';
import { effectVariablesCss } from './effects';

export const rootVariablesCss = `
:root {
${colorVariablesCss}
${typographyVariablesCss}
${effectVariablesCss}
}
`;
