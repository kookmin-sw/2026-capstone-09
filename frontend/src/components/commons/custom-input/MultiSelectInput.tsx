'use client';

import { FormField, List, ListCell, ContentBadge } from '@wanteddev/wds';
import { Box } from '@wanteddev/wds-engine';
import type { Theme } from '@wanteddev/wds-engine';
import { IconCheck, IconPerson, IconFolder, IconSend, IconChevronDownThickSmall, IconChevronUpThickSmall } from '@wanteddev/wds-icon';
import {ReactNode, useEffect, useState, useRef, useCallback, useMemo } from 'react';

export interface UserOption {
  id: string;
  label: string;
  profileImageUrl?: string;
  trailingContent?: ReactNode;
}

export interface NodeOption {
  id: string;
  label: string;
  nodeId: number;
  number?: string;
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
  autoFocus?: boolean;
}

type MenuStage = 'category' | 'user-list' | 'node-list' | 'combined-list' | null;

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

// leadingContent 생성 헬퍼 함수
const createUserLeadingContent = (user: UserOption): ReactNode => {
  if (user.profileImageUrl) {
    return (
      <img
        src={user.profileImageUrl}
        alt={user.label}
        className="w-6 h-6 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-fill-alternative flex items-center justify-center">
      <IconPerson width={16} height={16} />
    </div>
  );
};

const createNodeLeadingContent = (node: NodeOption): ReactNode => {
  const isSubNode = node.number?.includes('.');

  return (
    <ContentBadge
      size="xsmall"
      variant={isSubNode ? 'outlined' : 'solid'}
      color={isSubNode ? 'neutral' : undefined}
      className={isSubNode ? undefined : '!bg-primary-40/10 !text-primary-40'}
    >
      #{node.number}
    </ContentBadge>
  );
};

export const MultiSelectInput = ({
  placeholder,
  userOptions,
  nodeOptions,
  value,
  onChange,
  onSubmit,
  className,
  autoFocus = false,
}: MultiSelectInputProps) => {
  const [inputText, setInputText] = useState(value.text);
  const [menuStage, setMenuStage] = useState<MenuStage>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const [currentType, setCurrentType] = useState<'user' | 'node' | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // autoFocus 처리
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const selectedItems: SelectedItem[] = useMemo(() => value.mentions.map((mention) => {
    if (mention.type === 'user') {
      const user = userOptions.find((u) => u.id === mention.id);
      return {
        type: 'user',
        id: mention.id,
        label: user?.label || '',
        leadingContent: user ? createUserLeadingContent(user) : undefined,
      };
    } else {
      const node = nodeOptions.find((n) => n.id === mention.id);
      return {
        type: 'node',
        id: mention.id,
        label: node?.label || '',
        leadingContent: node ? createNodeLeadingContent(node) : undefined,
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

        if (matchingUsers.length > 0 && matchingNodes.length > 0 && menuStage !== 'user-list' && menuStage !== 'node-list') {
          if (menuStage !== 'combined-list') {
            setMenuStage('combined-list');
            setSelectedIndex(0);
          }
        } else if (matchingUsers.length > 0) {
          if (menuStage !== 'user-list') {
            setMenuStage('user-list');
            setCurrentType('user');
            setSelectedIndex(0);
          }
        } else if (matchingNodes.length > 0) {
          if (menuStage !== 'node-list') {
            setMenuStage('node-list');
            setCurrentType('node');
            setSelectedIndex(0);
          }
        } else {
          setMenuStage(null);
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
    setSelectedIndex(0);
    setSearchQuery('');

    if (currentType !== category) {
      const alreadySelected = value.mentions
        .filter((m) => m.type === category)
        .map((m) => m.id);
      setTempSelectedIds(alreadySelected);
    }
  };

  const handleItemToggle = (itemId: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const confirmSelection = useCallback((appendSpace = false) => {
    if (menuStage === 'user-list' || menuStage === 'node-list') {
      if (!currentType) return;

      const atIndex = inputText.lastIndexOf('@');
      const newText = inputText.slice(0, atIndex) + (appendSpace ? ' ' : '');

      setInputText(newText);
      setSelectedIndex(0);
      setMenuStage(null);
      setSearchQuery('');

      const otherMentions = value.mentions.filter((m) => m.type !== currentType);
      const currentTypeMentions = tempSelectedIds.map((id) => ({ type: currentType, id }));

      onChange?.({
        text: newText,
        mentions: [...otherMentions, ...currentTypeMentions],
      });

      setTempSelectedIds([]);
      setCurrentType(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else if (menuStage === 'combined-list') {
      const atIndex = inputText.lastIndexOf('@');
      const newText = inputText.slice(0, atIndex) + (appendSpace ? ' ' : '');

      setInputText(newText);
      setSelectedIndex(0);
      setMenuStage(null);
      setSearchQuery('');

      let mergedMentions = value.mentions;

      if (currentType) {
        const otherMentions = value.mentions.filter((m) => m.type !== currentType);
        const currentTypeMentions = tempSelectedIds.map((id) => ({
          type: currentType,
          id,
        }));

        mergedMentions = [...otherMentions, ...currentTypeMentions];
      }

      onChange?.({
        text: newText,
        mentions: mergedMentions,
      });

      setTempSelectedIds([]);
      setCurrentType(null);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [menuStage, currentType, inputText, tempSelectedIds, onChange, value.mentions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        (menuStage === 'user-list' || menuStage === 'node-list' || menuStage === 'combined-list')
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
    if (menuStage === 'user-list' || menuStage === 'node-list' || menuStage === 'combined-list') {
      confirmSelection();
    }
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;

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
    if (isComposing) return;

    if (menuStage === 'category') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev === 0 ? 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev === 1 ? 0 : prev));
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const category = selectedIndex === 0 ? 'user' : 'node';
        handleCategorySelect(category);
      }
    } 

    else if (menuStage === 'user-list' || menuStage === 'node-list') {
      const options = menuStage === 'user-list' ? filteredUserOptions : filteredNodeOptions;
      const atIndex = inputText.lastIndexOf('@');

      if (e.key === ' ') {
        e.preventDefault();
        confirmSelection(true);
        return;
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, options.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (atIndex === -1 && inputText.trim()) {
          handleSubmit();
        } else if (options.length > 0) {
          handleItemToggle(options[selectedIndex].id);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        confirmSelection();
      }
    }

    else if (menuStage === 'combined-list') {
      const combinedOptions = [
        ...filteredUserOptions.map(item => ({ ...item, type: 'user' as const })),
        ...filteredNodeOptions.map(item => ({ ...item, type: 'node' as const }))
      ];

      if (e.key === ' ') {
        e.preventDefault();
        confirmSelection(true);
        return;
      } else if (e.key === 'Tab') {
        e.preventDefault();
        confirmSelection();
        return;
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, combinedOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (combinedOptions.length > 0) {
          const selectedItem = combinedOptions[selectedIndex];

          if (currentType === selectedItem.type) {
            handleItemToggle(selectedItem.id);
            return;
          }

          const otherMentions = value.mentions.filter(
              (m) => !(m.type === selectedItem.type && m.id === selectedItem.id)
          );
          const isSelected = value.mentions.some(
              (m) => m.type === selectedItem.type && m.id === selectedItem.id
          );
          const newMentions = isSelected
              ? otherMentions
              : [...otherMentions, { type: selectedItem.type, id: selectedItem.id }];

          onChange?.({ text: inputText, mentions: newMentions });
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        confirmSelection();
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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
                  {(() => {
                    const userCount = selectedItems.filter(i => i.type === 'user').length;
                    const nodeCount = selectedItems.filter(i => i.type === 'node').length;

                    if (userCount > 0 && nodeCount > 0) {
                      return `참조된 사용자 ${userCount}명, 노드 ${nodeCount}개`;
                    } else if (userCount > 0) {
                      return `참조된 사용자 ${userCount}명`;
                    } else {
                      return `참조된 노드 ${nodeCount}개`;
                    }
                  })()}
                </Box>
              </ListCell>

              {isListExpanded && (() => {
                const hasUsers = selectedItems.some(i => i.type === 'user');
                const hasNodes = selectedItems.some(i => i.type === 'node');
                const showHeaders = hasUsers && hasNodes;

                return (
                  <>
                    {hasUsers && (
                      <>
                        {showHeaders && (
                          <Box sx={(theme: Theme) => ({
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.75rem',
                            color: theme.semantic.label.alternative,
                            fontWeight: 600
                          })}>
                            사용자
                          </Box>
                        )}
                        {selectedItems
                          .map((item, index) => ({ item, index }))
                          .filter(({ item }) => item.type === 'user')
                          .map(({ item, index }) => (
                            <ListCell
                              key={`${item.type}-${item.id}-${index}`}
                              leadingContent={item.leadingContent}
                              sx={{
                                padding: '0.75rem',
                              }}
                            >
                              {item.label}
                            </ListCell>
                          ))}
                      </>
                    )}
                    {hasNodes && (
                      <>
                        {showHeaders && (
                          <Box sx={(theme: Theme) => ({
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.75rem',
                            color: theme.semantic.label.alternative,
                            fontWeight: 600,
                            marginTop: '0.5rem'
                          })}>
                            노드
                          </Box>
                        )}
                        {selectedItems
                          .map((item, index) => ({ item, index }))
                          .filter(({ item }) => item.type === 'node')
                          .map(({ item, index }) => (
                            <ListCell
                              key={`${item.type}-${item.id}-${index}`}
                              leadingContent={item.leadingContent}
                              sx={{
                                padding: '0.75rem',
                              }}
                            >
                              {item.label}
                            </ListCell>
                          ))}
                      </>
                    )}
                  </>
                );
              })()}
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
                      background: selectedIndex === 0 ? theme.semantic.background.normal.alternative : 'transparent',
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
                      background: selectedIndex === 1 ? theme.semantic.background.normal.alternative : 'transparent',
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
                    const isUserList = menuStage === 'user-list';
                    return options.length > 0 ? (
                      options.map((item, index) => {
                        const isSelected = tempSelectedIds.includes(item.id);
                        const isSelectedIndex = index === selectedIndex;
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
                              backgroundColor: isSelected || isSelectedIndex ? theme.semantic.background.normal.alternative : 'transparent',
                              '&:hover': {
                                backgroundColor: theme.semantic.background.normal.alternative,
                              },
                            })}
                          >
                            {isUserList ? createUserLeadingContent(item as UserOption) : createNodeLeadingContent(item as NodeOption)}
                            <Box sx={{ flex: 1 }}>{item.label}</Box>
                            {item.trailingContent}
                            {isSelected && <IconCheck width={16} height={16} style={{ color: '#04E6A2' }} />}
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

              {menuStage === 'combined-list' && (
                <Box sx={{ maxHeight: '12.5rem', overflowY: 'auto' }}>
                  {filteredUserOptions.length > 0 && (
                    <>
                      <Box sx={(theme: Theme) => ({
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.75rem',
                        color: theme.semantic.label.alternative,
                        fontWeight: 600
                      })}>
                        사용자
                      </Box>
                      {filteredUserOptions.map((item, index) => {
                        const isSelected =
                            currentType === 'user'
                                ? tempSelectedIds.includes(item.id)
                                : value.mentions.some((m) => m.type === 'user' && m.id === item.id);

                        const isSelectedIndex = index === selectedIndex;
                        return (
                          <Box
                            as="button"
                            type="button"
                            role="menuitemcheckbox"
                            aria-checked={isSelected}
                            key={`user-${item.id}`}
                            onClick={() => {
                              if (currentType === 'user') {
                                handleItemToggle(item.id);
                                return;
                              }

                              const otherMentions = value.mentions.filter(m => !(m.type === 'user' && m.id === item.id));
                              const newMentions = isSelected
                                ? otherMentions
                                : [...otherMentions, { type: 'user' as const, id: item.id }];
                              onChange?.({ text: inputText, mentions: newMentions });
                            }}
                            sx={(theme: Theme) => ({
                              ...MENU_ITEM_STYLES,
                              backgroundColor: isSelected || isSelectedIndex ? theme.semantic.background.normal.alternative : 'transparent',
                              '&:hover': {
                                backgroundColor: theme.semantic.background.normal.alternative,
                              },
                            })}
                          >
                            {createUserLeadingContent(item)}
                            <Box sx={{ flex: 1 }}>{item.label}</Box>
                            {item.trailingContent}
                            {isSelected && <IconCheck width={16} height={16} style={{ color: '#04E6A2' }} />}
                          </Box>
                        );
                      })}
                    </>
                  )}
                  {filteredNodeOptions.length > 0 && (
                    <>
                      <Box sx={(theme: Theme) => ({
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.75rem',
                        color: theme.semantic.label.alternative,
                        fontWeight: 600,
                        marginTop: '0.5rem'
                      })}>
                        노드
                      </Box>
                      {filteredNodeOptions.map((item, index) => {
                        const isSelected =
                            currentType === 'node'
                                ? tempSelectedIds.includes(item.id)
                                : value.mentions.some((m) => m.type === 'node' && m.id === item.id);

                        const globalIndex = filteredUserOptions.length + index;
                        const isSelectedIndex = globalIndex === selectedIndex;
                        return (
                          <Box
                            as="button"
                            type="button"
                            role="menuitemcheckbox"
                            aria-checked={isSelected}
                            key={`node-${item.id}`}
                            onClick={() => {
                              if (currentType === 'node') {
                                handleItemToggle(item.id);
                                return;
                              }

                              const otherMentions = value.mentions.filter(m => !(m.type === 'node' && m.id === item.id));
                              const newMentions = isSelected
                                ? otherMentions
                                : [...otherMentions, { type: 'node' as const, id: item.id }];
                              onChange?.({ text: inputText, mentions: newMentions });
                            }}
                            sx={(theme: Theme) => ({
                              ...MENU_ITEM_STYLES,
                              backgroundColor: isSelected || isSelectedIndex ? theme.semantic.background.normal.alternative : 'transparent',
                              '&:hover': {
                                backgroundColor: theme.semantic.background.normal.alternative,
                              },
                            })}
                          >
                            {createNodeLeadingContent(item)}
                            <Box sx={{ flex: 1 }}>{item.label}</Box>
                            {item.trailingContent}
                            {isSelected && <IconCheck width={16} height={16} style={{ color: '#04E6A2' }} />}
                          </Box>
                        );
                      })}
                    </>
                  )}
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