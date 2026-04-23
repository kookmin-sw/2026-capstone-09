'use client';

import { FormField, FormLabel, FormControl, MenuItem, ContentBadge, Menu, MenuTrigger, MenuContent, MenuList, FlexBox } from '@wanteddev/wds';
import { Box } from '@wanteddev/wds-engine';
import type { Theme } from '@wanteddev/wds-engine';
import { IconChevronUpThickSmall, IconChevronDownThickSmall, IconClose } from '@wanteddev/wds-icon';
import type { ReactNode } from 'react';
import { useRef, useState, useEffect } from 'react';
import { useVisibleBadgeCount } from '@/hooks/useVisibleBadgeCount';

export interface DropdownOption {
  label: string;
  value: string;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
}

export interface DropdownInputProps {
  heading?: string;
  value?: string[];
  options: DropdownOption[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const DropdownInput = ({
  heading,
  value = [],
  options,
  onChange,
  placeholder,
  width = '100%',
  height = '3rem',
  className,
}: DropdownInputProps) => {
  const selectedValues = value;
  // 먼저 선택한 것이 앞에 오도록 value 배열 순서대로 정렬
  const selectedOptions = selectedValues
    .map((val) => options.find((opt) => opt.value === val))
    .filter((opt): opt is DropdownOption => opt !== undefined);

  // Ref 생성
  const containerRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const plusBadgeRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅으로 표시할 배지 개수 계산
  const visibleCount = useVisibleBadgeCount(
    selectedOptions,
    containerRef,
    badgesRef,
    iconRef,
    plusBadgeRef
  );

  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  // 드롭다운 너비 설정
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setTriggerWidth(containerRef.current.offsetWidth);
      }
    };

    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    updateWidth();

    return () => observer.disconnect();
  }, []);

  const visibleOptions = selectedOptions.slice(0, visibleCount);
  const remainingCount = selectedOptions.length - visibleCount;

  const handleRemove = (valueToRemove: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    onChange?.(newValues);
  };

  return (
    <FormField gap={8}>
      {heading && (
        <FormLabel
          variant="label1"
          weight="bold"
          sx={(theme: Theme) => ({
            color: theme.semantic.label.neutral,
          })}
        >
          {heading}
        </FormLabel>
      )}
      <FormControl>
        <Menu
          value={selectedValues}
          onValueChange={(newValue) => {
            onChange?.(newValue as string[]);
          }}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <MenuTrigger>
            <FlexBox
              ref={containerRef}
              gap="0.5rem"
              alignItems="center"
              role="combobox"
              tabIndex={0}
              aria-expanded={isOpen}
              className={className}
              sx={(theme: Theme) => ({
                position: 'relative',
                width: width,
                height: height,
                padding: '0.75rem',
                backgroundColor: theme.semantic.background.transparent.normal,
                backdropFilter: 'blur(2rem)',
                borderRadius: '0.75rem',
                boxShadow: isOpen
                  ? `inset 0 0 0 0.125rem #33EBC366, ${theme.semantic.elevation.shadow.normal.xsmall}`
                  : `inset 0 0 0 0.0625rem ${theme.semantic.line.normal.neutral}, ${theme.semantic.elevation.shadow.normal.xsmall}`,
                cursor: 'pointer',
                outline: 'none',
                '&:focus, &:focus-visible': {
                  outline: 'none',
                  boxShadow: `inset 0 0 0 0.125rem #33EBC366, ${theme.semantic.elevation.shadow.normal.xsmall}`,
                },
              })}
            >
              <FlexBox
                flex="1"
                gap="0.25rem"
                alignItems="center"
                data-role="select-multiple-render-wrapper"
                sx={{
                  overflow: 'hidden',
                  minWidth: 0,
                  minHeight: '1.5rem',
                }}
              >
                {selectedOptions.length === 0 ? (
                  <Box
                    data-role="select-multiple-placeholder"
                    sx={(theme: Theme) => ({
                      color: theme.semantic.label.assistive,
                      fontSize: '1rem',
                      lineHeight: '1.5rem',
                      minHeight: '1.5rem',
                      userSelect: 'none',
                    })}
                  >
                    {placeholder}
                  </Box>
                ) : (
                  <>
                    {/* 측정용 숨겨진 배지들 */}
                    <FlexBox
                      ref={badgesRef}
                      gap="0.25rem"
                      sx={{
                        position: 'absolute',
                        visibility: 'hidden',
                        pointerEvents: 'none',
                      }}
                    >
                      {selectedOptions.map((option) => (
                        <ContentBadge
                          key={option.value}
                          size="small"
                          variant="solid"
                          color="neutral"
                          leadingContent={option.leadingContent}
                          trailingContent={<IconClose width={16} height={16} />}
                          sx={{ paddingLeft: 12, gap: 12 }}
                        >
                          {option.label}
                        </ContentBadge>
                      ))}
                    </FlexBox>
                    {/* 측정용 +N 배지 */}
                    <Box
                      ref={plusBadgeRef}
                      sx={{
                        position: 'absolute',
                        visibility: 'hidden',
                        pointerEvents: 'none',
                      }}
                    >
                      <ContentBadge size="small" variant="solid" color="neutral" sx={{ paddingLeft: 12, gap: 12 }}>
                        +99
                      </ContentBadge>
                    </Box>
                    {visibleOptions.map((option) => (
                      <ContentBadge
                        key={option.value}
                        size="small"
                        variant="solid"
                        color="neutral"
                        leadingContent={option.leadingContent}
                        trailingContent={
                            <button
                                type="button"
                                onClick={handleRemove(option.value)}
                                aria-label={`${option.label} 제거`}
                            >
                                <IconClose width={16} height={16}/>
                            </button>
                        }
                        sx={{
                            flexShrink: 0,
                            paddingLeft: 12,
                            gap: 12,
                        }}
                      >
                        {option.label}
                      </ContentBadge>
                    ))}
                    {remainingCount > 0 && (
                      <ContentBadge
                        size="small"
                        variant="solid"
                        color="neutral"
                        sx={{
                          flexShrink: 0,
                          paddingLeft: 12,
                          gap: 12,
                        }}
                      >
                        +{remainingCount}
                      </ContentBadge>
                    )}
                  </>
                )}
              </FlexBox>
              <FlexBox
                ref={iconRef}
                alignItems="center"
                sx={(theme: Theme) => ({
                  flexShrink: 0,
                  fontSize: '1rem',
                  margin: '0.25rem',
                  color: theme.semantic.label.alternative,
                })}
              >
                {isOpen ? (
                  <IconChevronUpThickSmall />
                ) : (
                  <IconChevronDownThickSmall />
                )}
              </FlexBox>
            </FlexBox>
          </MenuTrigger>
          <MenuContent
            offset={8}
            position="bottom-center"
            sx={{ width: triggerWidth, minWidth: '8.75rem' }}
          >
            <MenuList>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  variant="normal"
                  leadingContent={
                    option.leadingContent && (
                      <Box sx={{ marginRight: 8 }}>
                        {option.leadingContent}
                      </Box>
                    )
                  }
                  trailingContent={
                    option.trailingContent && (
                      <Box
                        sx={(theme: Theme) => ({
                          color: theme.semantic.label.alternative,
                        })}
                      >
                        {option.trailingContent}
                      </Box>
                    )
                  }
                >
                  <span
                    style={{
                      color: isSelected ? '#03C98F' : 'inherit',
                    }}
                  >
                    {option.label}
                  </span>
                </MenuItem>
              );
              })}
            </MenuList>
          </MenuContent>
        </Menu>
      </FormControl>
    </FormField>
  );
};

DropdownInput.displayName = 'DropdownInput';