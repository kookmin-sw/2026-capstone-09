import { Button, Switch } from '@wanteddev/wds';
import { IconAiReview, IconPlus, IconPresentation } from '@wanteddev/wds-icon';

interface NodeButtonProps {
  onAddMainNode: () => void;
  onAddSubNode?: () => void;
  onAddMeeting?: () => void;
  onAISummary?: () => void;
  showDashedLines?: boolean;
  onToggleDashedLines?: (value: boolean) => void;
  isCreating?: boolean;
}

export function NodeButton({
  onAddMainNode,
  onAddSubNode,
  onAddMeeting,
  onAISummary,
  showDashedLines = false,
  onToggleDashedLines,
  isCreating = false,
}: NodeButtonProps) {

  return (
    <div className="px-3 py-2 bg-white rounded-xl inline-flex justify-start items-center gap-3">
      <div className="flex justify-start items-center gap-1.5">
        <span className="text-label-alternative/60 text-xs font-medium">점선 표시</span>
        <Switch
          size="small"
          checked={showDashedLines}
          onCheckedChange={onToggleDashedLines}
        />
      </div>

      <Button
        variant="solid"
        color="primary"
        size="small"
        onClick={onAddMainNode}
        disabled={isCreating}
        leadingContent={<IconPlus />}
      >
        메인 노드
      </Button>

      <Button
        variant="solid"
        color={onAddSubNode ? 'primary' : 'assistive'}
        size="small"
        onClick={onAddSubNode}
        disabled={!onAddSubNode || isCreating}
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
        leadingContent={<IconPresentation />}
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
}