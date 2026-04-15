import {
    IconBubblePlus,
    IconCircleClose,
    IconPencil,
    IconPin,
    IconPlus,
    IconTrash,
} from '@wanteddev/wds-icon';

export type DropdownVariant = 'link' | 'nodeBeforeMeeting' | 'nodeAfterMeeting';

type DropdownItemType =
    | 'subNode'
    | 'createMeeting'
    | 'editMeeting'
    | 'reference'
    | 'deleteMeeting'
    | 'delete'
    | 'edit';

interface DropdownProps {
    x: number;
    y: number;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    variant: DropdownVariant;
}

const DROPDOWN_ITEM_MAP: Record<
    DropdownItemType,
    {
        label: string;
        icon: React.ReactNode;
        textClassName: string;
    }
> = {
    subNode: {
        label: '서브 노드 생성',
        icon: <IconPlus className="h-5 w-5 text-label-alternative" />,
        textClassName: 'text-body-2 text-label-alternative',
    },
    createMeeting: {
        label: '회의 생성',
        icon: <IconBubblePlus className="h-5 w-5 text-label-alternative" />,
        textClassName: 'text-body-2 text-label-alternative',
    },
    editMeeting: {
        label: '회의 수정',
        icon: <IconPencil className="h-5 w-5 text-label-alternative" />,
        textClassName: 'text-body-2 text-label-alternative',
    },
    reference: {
        label: '참조 노드',
        icon: <IconPin className="h-5 w-5 text-label-alternative" />,
        textClassName: 'text-body-2 text-label-alternative',
    },
    deleteMeeting: {
        label: '회의 삭제',
        icon: <IconCircleClose className="h-5 w-5 text-status-negative" />,
        textClassName: 'text-body-2 text-status-negative',
    },
    delete: {
        label: '삭제',
        icon: <IconTrash className="h-5 w-5 text-status-negative" />,
        textClassName: 'text-body-2 text-status-negative',
    },
    edit: {
        label: '수정',
        icon: <IconPencil className="h-5 w-5 text-label-alternative" />,
        textClassName: 'text-body-2 text-label-alternative',
    },
};

const DROPDOWN_ITEMS_BY_VARIANT: Record<DropdownVariant, DropdownItemType[]> = {
    link: ['edit', 'delete'],
    nodeBeforeMeeting: ['subNode', 'createMeeting', 'reference', 'delete'],
    nodeAfterMeeting: ['subNode', 'editMeeting', 'reference', 'deleteMeeting', 'delete'],
};

export const Dropdown = ({ x, y, dropdownRef, variant }: DropdownProps) => {
    const items = DROPDOWN_ITEMS_BY_VARIANT[variant];

    return (
        <div
            ref={dropdownRef}
            className="fixed z-50 min-w-[140px] rounded-lg border border-gray-200 bg-white"
            style={{
                top: y + 4,
                left: x,
                boxShadow: 'var(--shadow---normal---xsmall)',
            }}
        >
            <div className="flex flex-col gap-1 px-2 py-2">
                {items.map((item) => {
                    const menu = DROPDOWN_ITEM_MAP[item];

                    return (
                        <button
                            key={item}
                            type="button"
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-fill-normal"
                        >
                            {menu.icon}
                            <span className={menu.textClassName}>
                {menu.label}
              </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};