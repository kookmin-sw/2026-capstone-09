'use client';

import { useEffect, useRef, useState } from 'react';

import { useClickOutside } from '@/hooks/useClickOutside';

export function usePickerState() {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outsideCloseDisabledRef = useRef(false);

  useClickOutside(containerRef, isPickerOpen, () => {
    if (outsideCloseDisabledRef.current) return;
    setIsPickerOpen(false);
    setInputValue('');
    setSelectedIndex(-1);
  });

  useEffect(() => {
    if (isPickerOpen) inputRef.current?.focus();
  }, [isPickerOpen]);

  const resetInput = () => {
    setInputValue('');
    setSelectedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedIndex(-1);
  };

  const setOutsideCloseDisabled = (disabled: boolean) => {
    outsideCloseDisabledRef.current = disabled;
  };

  return {
    isPickerOpen,
    setIsPickerOpen,
    inputValue,
    selectedIndex,
    setSelectedIndex,
    containerRef,
    inputRef,
    resetInput,
    handleInputChange,
    setOutsideCloseDisabled,
  };
}
