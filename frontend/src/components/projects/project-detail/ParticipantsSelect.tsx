'use client';

import { Avatar, Chip } from '@wanteddev/wds';
import { IconChevronDownThickSmall, IconClose } from '@wanteddev/wds-icon';
import {
  KeyboardEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

export interface ParticipantOption {
  id: string;
  name: string;
  email?: string;
}

interface ParticipantsSelectProps {
  options: readonly ParticipantOption[];
  value: readonly ParticipantOption[];
  onChange: (next: readonly ParticipantOption[]) => void;
  placeholder?: string;
}

export const ParticipantsSelect = ({
  options,
  value,
  onChange,
  placeholder,
}: ParticipantsSelectProps) => {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const customIdCounterRef = useRef(0);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const selectedIds = useMemo(() => new Set(value.map((item) => item.id)), [value]);

  const filtered = useMemo(() => {
    const query = input.trim().toLowerCase();
    return options
      .filter((option) => !selectedIds.has(option.id))
      .filter((option) => {
        if (!query) return true;
        return (
          option.name.toLowerCase().includes(query) ||
          (option.email?.toLowerCase().includes(query) ?? false)
        );
      });
  }, [options, selectedIds, input]);

  const showCustomSuggestion =
    input.trim().length > 0 &&
    !filtered.some(
      (option) =>
        option.name.toLowerCase() === input.trim().toLowerCase() ||
        option.email?.toLowerCase() === input.trim().toLowerCase(),
    ) &&
    !value.some(
      (item) =>
        item.name.toLowerCase() === input.trim().toLowerCase() ||
        item.email?.toLowerCase() === input.trim().toLowerCase(),
    );

  // 드롭다운 위치 계산(Portal + fixed positioning)
  useLayoutEffect(() => {
    if (!open) return;
    const updateRect = () => {
      if (containerRef.current) {
        setAnchorRect(containerRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [open]);

  // 외부 클릭 감지(트리거 + Portal 드롭다운 모두 포함)
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [open]);

  const addParticipant = (option: ParticipantOption) => {
    if (selectedIds.has(option.id)) return;
    onChange([...value, option]);
    setInput('');
    inputRef.current?.focus();
  };

  const addCustom = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    customIdCounterRef.current += 1;
    addParticipant({
      id: `custom-${customIdCounterRef.current}`,
      name: trimmed,
    });
  };

  const removeParticipant = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (filtered.length > 0) {
        addParticipant(filtered[0]);
      } else if (input.trim().length > 0) {
        addCustom();
      }
      return;
    }
    if (event.key === 'Backspace' && input.length === 0 && value.length > 0) {
      event.preventDefault();
      removeParticipant(value[value.length - 1].id);
      return;
    }
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const dropdown =
    open && anchorRect
      ? createPortal(
          <div
            ref={dropdownRef}
            id={listboxId}
            role="listbox"
            style={{
              position: 'fixed',
              left: anchorRect.left,
              top: anchorRect.bottom + 8,
              width: anchorRect.width,
              zIndex: 10000,
            }}
            className="border-line-solid-neutral bg-background-elevated-normal max-h-80 overflow-y-auto overscroll-contain rounded-2xl border py-2 shadow-[0_4px_6px_-1px_rgba(23,23,23,0.06),0_2px_4px_-2px_rgba(23,23,23,0.06)] [scrollbar-color:color-mix(in_srgb,var(--color-label-alternative)_20%,transparent)_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] hover:[scrollbar-color:color-mix(in_srgb,var(--color-label-alternative)_30%,transparent)_transparent] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-label-alternative/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5"
          >
            {filtered.length === 0 && !showCustomSuggestion && (
              <p className="text-body-1 text-label-alternative px-5 py-2">검색 결과가 없어요.</p>
            )}
            {filtered.map((option) => (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => addParticipant(option)}
                className="hover:bg-fill-normal flex w-full items-center gap-3 border-none bg-transparent px-5 py-2 text-left"
              >
                <Avatar variant="person" size="xsmall" alt={option.name} />
                <span className="text-body-1 text-label-normal flex-1 truncate font-normal">
                  {option.name}
                </span>
                {option.email && (
                  <span className="text-body-1 text-label-alternative truncate">
                    {option.email}
                  </span>
                )}
              </button>
            ))}
            {showCustomSuggestion && (
              <button
                type="button"
                role="option"
                aria-selected={false}
                onClick={addCustom}
                className="hover:bg-fill-normal flex w-full items-center gap-3 border-none bg-transparent px-5 py-2 text-left"
              >
                <span className="text-body-1 text-label-normal flex-1 truncate font-normal">
                  {input.trim()}
                </span>
              </button>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 입력 필드: 고정 높이(h-12), 가로 스크롤 */}
      <div
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        className="border-line-normal-neutral focus-within:[box-shadow:inset_0_0_0_2px_color-mix(in_srgb,var(--color-primary-40)_43%,transparent)] flex h-12 w-full cursor-text items-center gap-2 overflow-hidden rounded-xl border bg-transparent [box-shadow:0_1px_2px_-1px_rgba(23,23,23,0.10)]"
      >
        <div className="flex h-full flex-1 items-center gap-2 overflow-x-auto overflow-y-hidden px-3 [&::-webkit-scrollbar]:h-0 [scrollbar-width:none]">
          {value.map((item) => (
            <div key={item.id} className="shrink-0">
              <Chip
                size="medium"
                variant="solid"
                disableInteraction
                leadingContent={<Avatar variant="person" size="xsmall" alt={item.name} />}
                trailingContent={
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      removeParticipant(item.id);
                    }}
                    onMouseDown={(event) => event.stopPropagation()}
                    aria-label={`${item.name} 제거`}
                    className="text-label-alternative hover:text-label-neutral relative z-10 flex h-4 w-4 cursor-pointer items-center justify-center border-none bg-transparent p-0"
                  >
                    <IconClose className="h-4 w-4" aria-hidden="true" />
                  </button>
                }
              >
                <span className="text-caption-1 text-label-alternative font-medium">
                  {item.name}
                </span>
              </Chip>
            </div>
          ))}
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleInputKeyDown}
            placeholder={value.length === 0 ? placeholder : undefined}
            className="text-body-1 text-label-normal placeholder:text-label-assistive h-full min-w-20 flex-1 shrink-0 border-none bg-transparent p-0 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setOpen((prev) => !prev);
            inputRef.current?.focus();
          }}
          aria-label="참여자 목록 열기"
          className="text-label-alternative hover:text-label-neutral mr-2 flex h-6 w-6 shrink-0 items-center justify-center border-none bg-transparent p-0"
        >
          <IconChevronDownThickSmall
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {dropdown}
    </div>
  );
};

ParticipantsSelect.displayName = 'ParticipantsSelect';
