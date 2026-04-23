import { Button, Switch } from '@wanteddev/wds';
import { IconAiReview, IconPlus, IconSparkle } from '@wanteddev/wds-icon';
import React, { useState } from 'react';

interface NodeButtonProps {
  onAddMainNode: () => void;
  onAddSubNode?: () => void;
  onAddMeeting?: () => void;
  onAISummary?: () => void;
}

const NodeButton: React.FC<NodeButtonProps> = ({
  onAddMainNode,
  onAddSubNode,
  onAddMeeting,
  onAISummary,
}) => {
  const [showDashedLines, setShowDashedLines] = useState(false);

  return (
    <div className="px-3 py-2 bg-white rounded-xl inline-flex justify-start items-center gap-3">
      <div className="flex justify-start items-center gap-1.5">
        <span className="text-label-alternative/60 text-xs font-medium">점선 표시</span>
        <Switch
          size="small"
          checked={showDashedLines}
          onCheckedChange={setShowDashedLines}
        />
      </div>

      <Button
        variant="solid"
        color="primary"
        size="small"
        onClick={onAddMainNode}
        leadingContent={<IconPlus />}
      >
        메인 노드
      </Button>

      <Button
        variant="solid"
        color={onAddSubNode ? 'primary' : 'assistive'}
        size="small"
        onClick={onAddSubNode}
        disabled={!onAddSubNode}
        leadingContent={<IconPlus />}
      >
        서브 노드
      </Button>

      <Button
        variant="solid"
        color={onAddMeeting ? 'primary' : 'assistive'}
        size="small"
        onClick={onAddMeeting}
        disabled={!onAddMeeting}
        leadingContent={<IconSparkle />}
      >
        회의 추가
      </Button>

      <Button
        variant="solid"
        color="primary"
        size="small"
        onClick={onAISummary}
        disabled={!onAISummary}
        leadingContent={<IconAiReview />}
      >
        AI 요약
      </Button>
    </div>
  );
};

export default NodeButton;