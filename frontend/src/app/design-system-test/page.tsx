'use client';

import { Button, ToastContainer, ToastContent, ToastIcon } from '@wanteddev/wds';
import { useState } from 'react';
import { PositionedToast } from '@/components/commons/toast/PositionedToast';
import { usePositionedToast } from '@/components/commons/toast/usePositionedToast';

const Demo = () => {
  const [open, setOpen] = useState(false);
  const toast = usePositionedToast();

  const handleClick = () => {
    toast({
      variant: 'normal',
      content: '우측 아래',
      placement: 'bottom-right',
    });
  };

  return (
    <>
      <PositionedToast open={open} onOpenChange={setOpen} duration="short" placement="top-right">
        <ToastContainer>
          <ToastIcon />
          <ToastContent>Content</ToastContent>
        </ToastContainer>
      </PositionedToast>

      <Button onClick={() => setOpen(true)}>JSX 테스트</Button>
      <Button onClick={handleClick}>훅 테스트</Button>
    </>
  );
};

export default Demo;
