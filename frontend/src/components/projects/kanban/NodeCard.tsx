import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContentBadge, ThemeColorsToken } from '@wanteddev/wds';
import { IconHandleDesktop } from '@wanteddev/wds-icon';
import { ColorType } from '@/constants/badgeColor';
import { getColorToken } from '@/utils/getBadgeColorInfo';
import { getVisibleTags } from '@/utils/nodeUtils';

interface NodeCardTag {
  tagId: number;
  name: string;
  color: string;
}

interface NodeCardProps {
  nodeId: number;
  nodeNumber: string;
  date: string;
  title: string;
  tags?: NodeCardTag[];
  isMainNode?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export function NodeCard({
  nodeId,
  nodeNumber,
  date,
  title,
  tags = [],
  isMainNode = false,
  onClick,
  onDoubleClick,
}: NodeCardProps) {
  const { visibleTags, remainingTagsCount } = getVisibleTags(tags, 5);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: nodeId,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex min-w-0 cursor-pointer select-none flex-col self-stretch rounded-lg border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-sm"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex items-center justify-between self-stretch">
        <div className="flex min-w-0 items-center gap-2">
          {isMainNode ? (
            <ContentBadge
              className="!bg-primary-40/10 !text-primary-40"
              size="xsmall"
              variant="solid"
            >
              <span
                style={{
                  display: 'inline-block',
                  maxWidth: '220px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'bottom',
                }}
              >
                #{nodeNumber}
              </span>
            </ContentBadge>
          ) : (
            <ContentBadge color="neutral" size="xsmall" variant="outlined">
              <span
                style={{
                  display: 'inline-block',
                  maxWidth: '220px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'bottom',
                }}
              >
                #{nodeNumber}
              </span>
            </ContentBadge>
          )}
          <div className="text-caption-2 text-label-alternative shrink-0 font-normal">
            {date}
          </div>
        </div>

        <div
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing text-label-assistive flex items-center"
        >
          <IconHandleDesktop className="pointer-events-none" />
        </div>
      </div>

      <div className="mt-1 min-w-0 self-stretch">
        <div className="text-body-1 truncate font-medium">{title}</div>
      </div>

      {tags.length > 0 && (
        <div className="mt-3 flex min-w-0 flex-wrap gap-1 self-stretch overflow-hidden">
          {visibleTags.map((tag) => (
            <ContentBadge
              key={tag.tagId}
              color="accent"
              size="small"
              accentColor={getColorToken(tag.color as ColorType) as ThemeColorsToken}
            >
              {tag.name}
            </ContentBadge>
          ))}
          {remainingTagsCount > 0 && (
            <ContentBadge color="neutral" size="small" variant="solid">
              +{remainingTagsCount}
            </ContentBadge>
          )}
        </div>
      )}
    </div>
  );
}
