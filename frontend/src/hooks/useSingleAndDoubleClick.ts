import { useState, useEffect } from 'react';

interface useSingleAndDoubleClickProps {
  actionSimpleClick: () => void;
  actionDoubleClick: () => void;
}

function useSingleAndDoubleClick(
  { actionSimpleClick, actionDoubleClick }: useSingleAndDoubleClickProps,
  delay = 250,
) {
  const [click, setClick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (click === 1) actionSimpleClick();
      setClick(0);
    }, delay);

    if (click === 2) actionDoubleClick();

    return () => clearTimeout(timer);
  }, [click]);

  return () => setClick((prev) => prev + 1);
}

export default useSingleAndDoubleClick;
