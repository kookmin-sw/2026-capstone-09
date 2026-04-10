'use client';

import { RegionConfig, Button, ToastContainer, ToastContent, ToastIcon } from '@wanteddev/wds';
import { useState } from 'react';
import { PositionedToast } from '@/components/commons/toast/PositionedToast';
import { usePositionedToast } from '@/components/commons/toast/usePositionedToast';

const Demo = () => {
  const [open, setOpen] = useState(false);
  const toast = usePositionedToast('bottom-center');

  const handleClick = () => {
    toast({
      variant: 'normal',
      content: '우측 아래',
      placement: 'bottom-left',
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

      <Button onClick={() => setOpen(true)}>토스트 메시지 테스트</Button>
      <Button onClick={handleClick}>훅으로 테스트하기</Button>

      <RegionConfig viewportBottom={`800px`} />
    </>
  );
};

export default Demo;
