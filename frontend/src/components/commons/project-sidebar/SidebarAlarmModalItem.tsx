'use client';

interface SidebarAlarmModalItemProps {
  title: string;
  description: string;
  timeText: string;
  isUnread?: boolean;
}

export const SidebarAlarmModalItem = ({
  title,
  description,
  timeText,
  isUnread = false,
}: SidebarAlarmModalItemProps) => {
  return (
    <button
      type="button"
      className="bg-static-white hover:bg-background-normal-alternative flex w-full flex-col gap-2 rounded-md px-2 py-3 text-left"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-body-2 text-label-normal min-w-0 flex-1 truncate font-medium">
          {title}
        </div>
        <div className="flex shrink-0 items-start gap-1">
          <div className="text-caption-1 text-label-alternative font-normal">{timeText}</div>
          {isUnread && (
            <span className="bg-primary-40 block h-1.5 w-1.5 rounded-full" aria-hidden="true" />
          )}
        </div>
      </div>
      <div className="text-label-2 text-label-neutral line-clamp-2 font-normal">{description}</div>
    </button>
  );
};
