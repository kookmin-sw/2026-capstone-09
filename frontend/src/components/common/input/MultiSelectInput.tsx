'use client';

import { FormField, List, ListCell } from '@wanteddev/wds';
import { Box } from '@wanteddev/wds-engine';
import type { Theme } from '@wanteddev/wds-engine';
import { IconCheck, IconPerson, IconFolder, IconSend, IconChevronDownThickSmall, IconChevronUpThickSmall } from '@wanteddev/wds-icon';
import type { ReactNode } from 'react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

export interface UserOption {
  id: string;
  label: string;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
}

export interface NodeOption {
  id: string;
  label: string;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
}

export interface SelectedItem {
  type: 'user' | 'node';
  id: string;
  label: string;
  leadingContent?: ReactNode;
}

export interface MultiSelectInputValue {
  text: string;
  mentions: Array<{ type: 'user' | 'node'; id: string }>;
}

export interface MultiSelectInputProps {
  placeholder?: string;
  userOptions: UserOption[];
  nodeOptions: NodeOption[];
  value: MultiSelectInputValue;
  onChange?: (value: MultiSelectInputValue) => void;
  onSubmit?: (value: MultiSelectInputValue) => void;
  className?: string;
}

type MenuStage = 'category' | 'user-list' | 'node-list' | null;

const MENU_ITEM_STYLES = {
  padding: '0.75rem 0.75rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  border: 'none',
  width: '100%',
  textAlign: 'left' as const,
};

export const MultiSelectInput = ({
  placeholder,
  userOptions,
  nodeOptions,
  value,
  onChange,
  onSubmit,
  className,
}: MultiSelectInputProps) => {
  const [inputText, setInputText] = useState(value.text);
  const [menuStage, setMenuStage] = useState<MenuStage>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [currentType, setCurrentType] = useState<'user' | 'node' | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedItems: SelectedItem[] = useMemo(() => value.mentions.map((mention) => {
    if (mention.type === 'user') {
      const user = userOptions.find((u) => u.id === mention.id);
      return {
        type: 'user',
        id: mention.id,
        label: user?.label || '',
        leadingContent: user?.leadingContent,
      };
    } else {
      const node = nodeOptions.find((n) => n.id === mention.id);
      return {
        type: 'node',
        id: mention.id,
        label: node?.label || '',
        leadingContent: node?.leadingContent,
      };
    }
  }), [value.mentions, userOptions, nodeOptions]);

  const filteredUserOptions = useMemo(() => userOptions.filter((user) =>
    user.label.toLowerCase().includes(searchQuery.toLowerCase())
  ), [userOptions, searchQuery]);

  const filteredNodeOptions = useMemo(() => nodeOptions.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  ), [nodeOptions, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;

    setInputText(newText);

    const atIndex = newText.lastIndexOf('@');

    if (atIndex !== -1) {
      setIsListExpanded(false);
      const query = newText.slice(atIndex + 1);

      if (query.startsWith(' ')) {
        setMenuStage(null);
        setSearchQuery('');
      } else if (query === '') {
        setMenuStage('category');
        setSearchQuery('');
      } else {
        setSearchQuery(query);
        const matchingUsers = userOptions.filter((user) =>
          user.label.toLowerCase().includes(query.toLowerCase())
        );
        const matchingNodes = nodeOptions.filter((node) =>
          node.label.toLowerCase().includes(query.toLowerCase())
        );

        if (matchingUsers.length > 0) {
          setMenuStage('user-list');
          setCurrentType('user');
        } else if (matchingNodes.length > 0) {
          setMenuStage('node-list');
          setCurrentType('node');
        } else {
          setMenuStage('category');
        }
      }
    } else {
      setMenuStage(null);
      setSearchQuery('');
    }

    onChange?.({
      text: newText,
      mentions: value.mentions,
    });
  };

  const handleCategorySelect = (category: 'user' | 'node') => {
    setCurrentType(category);
    setMenuStage(category === 'user' ? 'user-list' : 'node-list');
    setSearchQuery('');
    const alreadySelected = value.mentions
      .filter((m) => m.type === category)
      .map((m) => m.id);
    setTempSelectedIds(alreadySelected);
  };

  const handleItemToggle = (itemId: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const confirmSelection = useCallback(() => {
    if ((menuStage === 'user-list' || menuStage === 'node-list') && currentType) {
      const atIndex = inputText.lastIndexOf('@');
      const newText = inputText.slice(0, atIndex);

      setInputText(newText);
      setMenuStage(null);
      setSearchQuery('');

      const currentTypeMentions = tempSelectedIds.map((id) => ({ type: currentType, id }));

      onChange?.({
        text: newText,
        mentions: currentTypeMentions,
      });

      setTempSelectedIds([]);
      setCurrentType(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [menuStage, currentType, inputText, tempSelectedIds, onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        (menuStage === 'user-list' || menuStage === 'node-list') &&
        currentType
      ) {
        confirmSelection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuStage, currentType, confirmSelection]);

  const handleInputClick = () => {
    if (menuStage === 'user-list' || menuStage === 'node-list') {
      confirmSelection();
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim() && value.mentions.length === 0) return;

    onSubmit?.({
      text: inputText,
      mentions: value.mentions,
    });

    setInputText('');
    onChange?.({
      text: '',
      mentions: [],
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleRemoveItem = (index: number) => {
    const newMentions = value.mentions.filter((_, i) => i !== index);
    onChange?.({
      text: value.text,
      mentions: newMentions,
    });
  };

  return (
    <FormField gap={8}>
      <Box sx={{ position: 'relative' }}>
        <Box
          onClick={handleInputClick}
          sx={(theme: Theme) => ({
            position: 'relative',
            width: '100%',
            height: '3rem',
            backgroundColor: theme.semantic.background.transparent.normal,
            backdropFilter: 'blur(2rem)',
            borderRadius: '0.75rem',
            boxShadow: `inset 0 0 0 0.0625rem ${theme.semantic.line.normal.neutral}, ${theme.semantic.elevation.shadow.normal.xsmall}`,
            display: 'flex',
            alignItems: 'center',
          })}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={placeholder}
            className={className}
            style={{
              flex: 1,
              height: '100%',
              padding: '0.75rem',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '1rem',
              lineHeight: '1.5rem',
            }}
          />
          <Box
            as="button"
            type="button"
            onClick={handleSubmit}
            aria-label="전송"
            sx={(theme: Theme) => ({
              padding: '0 1rem',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: theme.semantic.label.alternative,
              '&:hover': {
                color: theme.semantic.label.normal,
              },
            })}
          >
            <IconSend width={20} height={20} />
          </Box>
        </Box>

        {selectedItems.length > 0 && (
          <Box
            sx={(theme: Theme) => ({
              position: 'absolute',
              bottom: '100%',
              left: '0.75rem',
              width: 'calc((100% - 1.5rem) / 0.75)',
              borderTop: `0.03125rem solid ${theme.semantic.line.normal.normal}`,
              borderLeft: `0.03125rem solid ${theme.semantic.line.normal.normal}`,
              borderRight: `0.03125rem solid ${theme.semantic.line.normal.normal}`,
              borderRadius: '0.75rem 0.75rem 0 0',
              overflow: 'hidden',
              backgroundColor: theme.semantic.background.elevated.normal,
              transform: 'scale(0.75)',
              transformOrigin: 'bottom left',
            })}
          >
            <List>
              <ListCell
                onClick={() => setIsListExpanded(!isListExpanded)}
                leadingContent={
                  <Box sx={(theme: Theme) => ({ color: theme.semantic.label.alternative })}>
                    {isListExpanded ? (
                      <IconChevronDownThickSmall width={16} height={16} />
                    ) : (
                      <IconChevronUpThickSmall width={16} height={16} />
                    )}
                  </Box>
                }
                sx={{
                  cursor: 'pointer',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  as="span"
                  sx={(theme: Theme) => ({
                    color: theme.semantic.label.alternative,
                    fontSize: '0.75rem',
                  })}
                >
                  {selectedItems[0]?.type === 'node'
                    ? `참조된 노드 ${selectedItems.length}개`
                    : `참조된 사용자 ${selectedItems.length}명`}
                </Box>
              </ListCell>

              {isListExpanded &&
                selectedItems.map((item, index) => (
                  <ListCell
                    key={`${item.type}-${item.id}-${index}`}
                    onClick={() => handleRemoveItem(index)}
                    leadingContent={item.leadingContent}
                    sx={{
                      cursor: 'pointer',
                      padding: '0.75rem',
                    }}
                  >
                    {item.label}
                  </ListCell>
                ))}
            </List>
          </Box>
        )}

        {menuStage && (
          <Box
            ref={menuRef}
            sx={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              marginBottom: '0.5rem',
              transform: 'scale(0.75)',
              transformOrigin: 'bottom left',
              zIndex: 1000,
            }}
          >
            <Box
              role="menu"
              sx={(theme: Theme) => ({
                minWidth: '25rem',
                backgroundColor: theme.semantic.background.elevated.normal,
                borderRadius: '0.75rem',
                boxShadow: theme.semantic.elevation.shadow.normal.medium,
                overflow: 'hidden',
              })}
            >
              {menuStage === 'category' && (
                <>
                  <Box
                    as="button"
                    type="button"
                    role="menuitem"
                    onClick={() => handleCategorySelect('user')}
                    sx={(theme: Theme) => ({
                      ...MENU_ITEM_STYLES,
                      background: 'none',
                      '&:hover': {
                        backgroundColor: theme.semantic.background.normal.alternative,
                      },
                    })}
                  >
                    <IconPerson width={20} height={20} />
                    사용자
                  </Box>
                  <Box
                    as="button"
                    type="button"
                    role="menuitem"
                    onClick={() => handleCategorySelect('node')}
                    sx={(theme: Theme) => ({
                      ...MENU_ITEM_STYLES,
                      background: 'none',
                      '&:hover': {
                        backgroundColor: theme.semantic.background.normal.alternative,
                      },
                    })}
                  >
                    <IconFolder width={20} height={20} />
                    노드
                  </Box>
                </>
              )}

              {(menuStage === 'user-list' || menuStage === 'node-list') && (
                <Box sx={{ maxHeight: '12.5rem', overflowY: 'auto' }}>
                  {(() => {
                    const options = menuStage === 'user-list' ? filteredUserOptions : filteredNodeOptions;
                    return options.length > 0 ? (
                      options.map((item) => {
                        const isSelected = tempSelectedIds.includes(item.id);
                        return (
                          <Box
                            as="button"
                            type="button"
                            role="menuitemcheckbox"
                            aria-checked={isSelected}
                            key={item.id}
                            onClick={() => handleItemToggle(item.id)}
                            sx={(theme: Theme) => ({
                              ...MENU_ITEM_STYLES,
                              backgroundColor: isSelected ? theme.semantic.background.normal.alternative : 'transparent',
                              '&:hover': {
                                backgroundColor: theme.semantic.background.normal.alternative,
                              },
                            })}
                          >
                            {item.leadingContent}
                            <Box sx={{ flex: 1 }}>{item.label}</Box>
                            {item.trailingContent}
                            {isSelected && <IconCheck width={16} height={16} style={{ color: '#33EBC3' }} />}
                          </Box>
                        );
                      })
                    ) : (
                      <Box role="status" sx={{ padding: '0.75rem 0.75rem', color: '#999' }}>
                        {currentType === 'user' ? '선택 가능한 사용자가 없습니다' : '선택 가능한 노드가 없습니다'}
                      </Box>
                    );
                  })()}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </FormField>
  );
};

MultiSelectInput.displayName = 'MultiSelectInput';