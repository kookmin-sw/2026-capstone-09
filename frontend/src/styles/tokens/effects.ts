type EffectVariant =
  | 'shadow-normal-xsmall'
  | 'shadow-normal-small'
  | 'shadow-normal-medium'
  | 'shadow-normal-large'
  | 'shadow-normal-xlarge'
  | 'shadow-spread-small'
  | 'shadow-spread-medium';

export const effectMap: Record<EffectVariant, string> = {
  'shadow-normal-xsmall': '0px 1px 2px rgba(23, 23, 23, 0.1)',
  'shadow-normal-small': '0px 4px 6px rgba(23, 23, 23, 0.06), 0px 2px 4px rgba(23, 23, 23, 0.06)',
  'shadow-normal-medium':
    '0px 10px 15px rgba(23, 23, 23, 0.07), 0px 4px 6px rgba(23, 23, 23, 0.07)',
  'shadow-normal-large':
    '0px 16px 24px rgba(23, 23, 23, 0.08), 0px 6px 10px rgba(23, 23, 23, 0.08)',
  'shadow-normal-xlarge':
    '0px 24px 38px rgba(23, 23, 23, 0.12), 0px 10px 15px rgba(23, 23, 23, 0.1)',
  'shadow-spread-small': '0px 0px 60px rgba(23, 23, 23, 0.1)',
  'shadow-spread-medium': '0px 15px 75px rgba(23, 23, 23, 0.16)',
};

const effectKeyMap: Record<EffectVariant, string> = {
  'shadow-normal-xsmall': 'shadow---normal---xsmall',
  'shadow-normal-small': 'shadow---normal---small',
  'shadow-normal-medium': 'shadow---normal---medium',
  'shadow-normal-large': 'shadow---normal---large',
  'shadow-normal-xlarge': 'shadow---normal---xlarge',
  'shadow-spread-small': 'shadow---spread---small',
  'shadow-spread-medium': 'shadow---spread---medium',
};

export const effectVariablesCss = Object.entries(effectMap)
  .map(([variant, value]) => {
    const key = effectKeyMap[variant as EffectVariant];
    return `--${key}: ${value};`;
  })
  .join('\n  ');
