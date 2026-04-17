'use client';

import {
  Alert,
  AlertActionArea,
  AlertActionAreaButton,
  AlertContainer,
  AlertContent,
  AlertDescription,
  AlertHeading,
  Button,
} from '@wanteddev/wds';
import { useState } from 'react';

const Demo = () => {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <>
      <Alert open={open} onOpenChange={setOpen}>
        <AlertContainer onDismiss={() => setResult('Dismissed')}>
          <AlertContent>
            <AlertHeading>Heading</AlertHeading>
            <AlertDescription>Description</AlertDescription>
          </AlertContent>
          <AlertActionArea>
            <AlertActionAreaButton variant="assistive" onClick={() => setResult('Cancel')}>
              Cancel
            </AlertActionAreaButton>
            <AlertActionAreaButton variant="normal" onClick={() => setResult('Confirm')}>
              Confirm
            </AlertActionAreaButton>
          </AlertActionArea>
        </AlertContainer>
      </Alert>

      <Button onClick={() => setOpen(true)}>Alert 테스트</Button>
    </>
  );
};

export default Demo;
