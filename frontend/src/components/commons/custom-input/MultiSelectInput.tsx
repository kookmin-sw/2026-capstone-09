'use client';

import { FormField, List, ListCell, ContentBadge, MenuList } from '@wanteddev/wds';
import { Box } from '@wanteddev/wds-engine';
import type { Theme } from '@wanteddev/wds-engine';
import { IconCheck, IconPerson, IconFolder, IconSend, IconChevronDownThickSmall, IconChevronUpThickSmall } from '@wanteddev/wds-icon';
import {ReactNode, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { normalizeImageUrl } from '@/utils/normalizeImageUrl';

export interface UserOption {
  id: string;
  label: string;
  profileImageUrl?: string;
  trailingContent?: ReactNode;
}

export interface NodeOption {
  id: string;
  label: string;
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

// 공통 ListCell 스타일
const getListCellStyle = (isSelectedIndex: boolean, extraStyles = {}) => (theme: Theme) => ({
  width: 'calc(100% - 16px)',
  padding: '12px',
  borderRadius: '16px',
  cursor: 'pointer',
  ...(isSelectedIndex && {
    backgroundColor: theme.semantic.background.normal.alternative,
  }),
  '&:hover': {
    backgroundColor: theme.semantic.background.normal.alternative,
  },
  ...extraStyles,
});

// leadingContent 생성 헬퍼 함수
const createUserLeadingContent = (user: UserOption): ReactNode => {
  const normalizedUrl = normalizeImageUrl(user.profileImageUrl);
  if (normalizedUrl) {
    return (
      <img
        src={normalizedUrl}
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
    <div className="flex items-center h-6">
      <ContentBadge
        size="xsmall"
        variant={isSubNode ? 'outlined' : 'solid'}
        color={isSubNode ? 'neutral' : undefined}
        className={isSubNode ? undefined : '!bg-primary-40/10 !text-primary-40'}
      >
        #{node.number}
      </ContentBadge>
    </div>
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
  const [isListExpanded, setIsListExpanded] = useState(false); // 초기값을 false로 변경 (닫힌 상태로 시작)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // 키보드 선택 항목 스크롤
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

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
    setIsListExpanded(false); // 리스트를 닫힌 상태로 변경
    onChange?.({
      text: '',
      mentions: value.mentions, // 참조 노드/사용자 유지
    });
  };

  // 선택된 항목 삭제 핸들러
  const handleRemoveItem = (item: SelectedItem) => {
    onChange?.({
      text: value.text,
      mentions: value.mentions.filter(
        (m) => !(m.type === item.type && m.id === item.id)
      ),
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
            className={`flex-1 h-full px-3 border-none bg-transparent outline-none text-base leading-6 ${className || ''}`}
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
                              onClick={() => handleRemoveItem(item)}
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
                              onClick={() => handleRemoveItem(item)}
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
                borderRadius: '1rem',
                boxShadow: theme.semantic.elevation.shadow.normal.medium,
                overflow: 'hidden',
              })}
            >
              {menuStage === 'category' && (
                <MenuList
                  sx={{ padding: '8px 0' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  <ListCell
                    role="menuitem"
                    alignItems="center"
                    disableInteraction={true}
                    onClick={() => handleCategorySelect('user')}
                    leadingContent={<IconPerson width={20} height={20} />}
                    sx={getListCellStyle(selectedIndex === 0)}
                  >
                    사용자
                  </ListCell>
                  <ListCell
                    role="menuitem"
                    alignItems="center"
                    disableInteraction={true}
                    onClick={() => handleCategorySelect('node')}
                    leadingContent={<IconFolder width={20} height={20} />}
                    sx={getListCellStyle(selectedIndex === 1)}
                  >
                    노드
                  </ListCell>
                </MenuList>
              )}

              {(menuStage === 'user-list' || menuStage === 'node-list') && (
                <MenuList
                  sx={{ maxHeight: '12.5rem', overflowY: 'auto' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  {(() => {
                    const options = menuStage === 'user-list' ? filteredUserOptions : filteredNodeOptions;
                    const isUserList = menuStage === 'user-list';
                    return options.length > 0 ? (
                      options.map((item, index) => {
                        const isSelected = tempSelectedIds.includes(item.id);
                        const isSelectedIndex = index === selectedIndex;
                        return (
                          <ListCell
                            key={item.id}
                            ref={(el) => { itemRefs.current[index] = el; }}
                            role="menuitem"
                            alignItems="center"
                            disableInteraction={true}
                            onClick={() => handleItemToggle(item.id)}
                            leadingContent={isUserList ? createUserLeadingContent(item as UserOption) : createNodeLeadingContent(item as NodeOption)}
                            trailingContent={
                              <div className="flex items-center gap-2">
                                {item.trailingContent}
                                {isSelected && <IconCheck width={16} height={16} className="text-primary-50" />}
                              </div>
                            }
                            sx={getListCellStyle(isSelectedIndex)}
                          >
                            {item.label}
                          </ListCell>
                        );
                      })
                    ) : (
                      <Box role="status" sx={{ padding: '0.75rem 0.75rem', color: '#999' }}>
                        {currentType === 'user' ? '선택 가능한 사용자가 없습니다' : '선택 가능한 노드가 없습니다'}
                      </Box>
                    );
                  })()}
                </MenuList>
              )}

              {menuStage === 'combined-list' && (
                <MenuList
                  sx={{ maxHeight: '12.5rem', overflowY: 'auto' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
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
                          <ListCell
                            key={`user-${item.id}`}
                            ref={(el) => { itemRefs.current[index] = el; }}
                            role="menuitem"
                            alignItems="center"
                            disableInteraction={true}
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
                            leadingContent={createUserLeadingContent(item)}
                            trailingContent={
                              <div className="flex items-center gap-2">
                                {item.trailingContent}
                                {isSelected && <IconCheck width={16} height={16} className="text-primary-50" />}
                              </div>
                            }
                            sx={getListCellStyle(isSelectedIndex)}
                          >
                            {item.label}
                          </ListCell>
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
                          <ListCell
                            key={`node-${item.id}`}
                            ref={(el) => { itemRefs.current[globalIndex] = el; }}
                            role="menuitem"
                            alignItems="center"
                            disableInteraction={true}
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
                            leadingContent={createNodeLeadingContent(item)}
                            trailingContent={
                              <div className="flex items-center gap-2">
                                {item.trailingContent}
                                {isSelected && <IconCheck width={16} height={16} className="text-primary-50" />}
                              </div>
                            }
                            sx={getListCellStyle(isSelectedIndex, { alignItems: 'center' })}
                          >
                            {item.label}
                          </ListCell>
                        );
                      })}
                    </>
                  )}
                </MenuList>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </FormField>
  );
};

MultiSelectInput.displayName = 'MultiSelectInput';