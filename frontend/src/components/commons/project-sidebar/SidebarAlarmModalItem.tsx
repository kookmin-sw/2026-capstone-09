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
      className="flex w-full flex-col gap-2 rounded-md bg-static-white px-2 py-3 text-left hover:bg-background-normal-alternative"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-body-2 font-normal text-label-normal">{title}</div>
        <div className="flex shrink-0 items-start gap-1">
          <div className="text-caption-1 font-normal text-label-alternative">{timeText}</div>
          <span
            className={isUnread ? 'block h-1.5 w-1.5 rounded-full bg-primary-40' : 'block h-1.5 w-1.5 rounded-full'}
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="text-label-2 font-normal text-label-neutral">{description}</div>
    </button>
  );
};
