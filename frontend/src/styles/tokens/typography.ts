type TypographyVariant =
  | 'display1'
  | 'display2'
  | 'display3'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'heading1'
  | 'heading2'
  | 'headline1'
  | 'headline2'
  | 'body1'
  | 'body1-reading'
  | 'body2'
  | 'body2-reading'
  | 'label1'
  | 'label1-reading'
  | 'label2'
  | 'caption1'
  | 'caption2';

type TypographyWeight = 'regular' | 'medium' | 'bold';

type TypographyStyle = {
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
};

export const variantMap: Record<TypographyVariant, TypographyStyle> = {
  display1: { fontSize: '3.5rem', lineHeight: '4.5rem', letterSpacing: '-0.0319em' },
  display2: { fontSize: '2.5rem', lineHeight: '3.25rem', letterSpacing: '-0.0282em' },
  display3: { fontSize: '2.25rem', lineHeight: '3rem', letterSpacing: '-0.027em' },
  title1: { fontSize: '2rem', lineHeight: '2.75rem', letterSpacing: '-0.0253em' },
  title2: { fontSize: '1.75rem', lineHeight: '2.375rem', letterSpacing: '-0.0236em' },
  title3: { fontSize: '1.5rem', lineHeight: '2rem', letterSpacing: '-0.023em' },
  heading1: { fontSize: '1.375rem', lineHeight: '1.875rem', letterSpacing: '-0.0194em' },
  heading2: { fontSize: '1.25rem', lineHeight: '1.75rem', letterSpacing: '-0.012em' },
  headline1: { fontSize: '1.125rem', lineHeight: '1.625rem', letterSpacing: '-0.002em' },
  headline2: { fontSize: '1.0625rem', lineHeight: '1.5rem', letterSpacing: '0em' },
  body1: { fontSize: '1rem', lineHeight: '1.5rem', letterSpacing: '0.0057em' },
  'body1-reading': { fontSize: '1rem', lineHeight: '1.625rem', letterSpacing: '0.0057em' },
  body2: { fontSize: '0.9375rem', lineHeight: '1.375rem', letterSpacing: '0.0096em' },
  'body2-reading': { fontSize: '0.9375rem', lineHeight: '1.5rem', letterSpacing: '0.0096em' },
  label1: { fontSize: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.0145em' },
  'label1-reading': { fontSize: '0.875rem', lineHeight: '1.375rem', letterSpacing: '0.0145em' },
  label2: { fontSize: '0.8125rem', lineHeight: '1.125rem', letterSpacing: '0.0194em' },
  caption1: { fontSize: '0.75rem', lineHeight: '1rem', letterSpacing: '0.0252em' },
  caption2: { fontSize: '0.6875rem', lineHeight: '0.875rem', letterSpacing: '0.0311em' },
};

export const getWeightMap = (variant: TypographyVariant): Record<TypographyWeight, number> => ({
  regular: 400,
  medium: 500,
  bold:
    variant === 'display1' ||
    variant === 'display2' ||
    variant === 'display3' ||
    variant === 'title1' ||
    variant === 'title2' ||
    variant === 'title3'
      ? 700
      : 600,
});

const variantVariablesCss = Object.entries(variantMap)
  .map(([variant, style]) => {
    return [
      `--typography---${variant}---font-size: ${style.fontSize};`,
      `--typography---${variant}---line-height: ${style.lineHeight};`,
      `--typography---${variant}---letter-spacing: ${style.letterSpacing};`,
    ].join('\n  ');
  })
  .join('\n  ');

const weightVariablesCss = [
  '--typography---weight---regular: 400;',
  '--typography---weight---medium: 500;',
  `--typography---weight---bold-display-title: ${getWeightMap('display1').bold};`,
  `--typography---weight---bold-default: ${getWeightMap('body1').bold};`,
].join('\n  ');

export const typographyVariablesCss = `
  ${variantVariablesCss}
  ${weightVariablesCss}
`;
