'use client';

import { Avatar, ContentBadge } from "@wanteddev/wds";
import { useState } from 'react';
import { DropdownInput } from "@/components/commons/input/DropdownInput";
import { MultiSelectInput, type MultiSelectInputValue } from '@/components/commons/input/MultiSelectInput';
import { TagInput } from '@/components/commons/input/TagInput';

export default function Home() {
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
    const [chatInput, setChatInput] = useState<MultiSelectInputValue>({
        text: '',
        mentions: [],
    });

    const peopleOptions = [
        {
            label: '황수민',
            value: '1',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span>sinji1012@kookmin.ac.kr</span>
        },
        {
            label: '황수민',
            value: '2',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span>sinji1012@kookmin.ac.kr</span>
        },
        {
            label: '황수민',
            value: '3',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span>sinji1012@kookmin.ac.kr</span>
        },
        {
            label: '황수민',
            value: '4',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span>sinji1012@kookmin.ac.kr</span>
        },
        {
            label: '황수민',
            value: '5',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span>sinji1012@kookmin.ac.kr</span>
        },
        {
            label: '황수민',
            value: '6',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span>sinji1012@kookmin.ac.kr</span>
        },
        {
            label: '황수민',
            value: '7',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span>sinji1012@kookmin.ac.kr</span>
        },
        {
            label: 'sinji1012@kookmin.ac.kr',
            value: '8',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span>sinji1012@kookmin.ac.kr</span>
        },
        {
            label: '메인노드입니다.',
            value: 'main-node',
            leadingContent: <ContentBadge
                size="xsmall"
                variant="solid"
                className="!bg-primary-60/10 !text-primary-60"
            >#1</ContentBadge>
        },
    ];

    const userOptions = [
        {
            id: 'user1',
            label: '황수민',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span style={{ fontSize: '12px', color: '#999' }}>sinji1012@kookmin.ac.kr</span>,
        },
        {
            id: 'user2',
            label: '황수민',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span style={{ fontSize: '12px', color: '#999' }}>sinji1012@kookmin.ac.kr</span>,
        },
        {
            id: 'user3',
            label: '황수민',
            leadingContent: <Avatar size="xsmall" />,
            trailingContent: <span style={{ fontSize: '12px', color: '#999' }}>sinji1012@kookmin.ac.kr</span>,
        },
    ];

    const nodeOptions = [
        {
            id: 'node1',
            label: '디자인 회의',
            leadingContent: <ContentBadge
                size="xsmall"
                variant="solid"
                className="!bg-primary-60/10 !text-primary-60"
            >#1</ContentBadge>,
        },
        {
            id: 'node2',
            label: '디자인 회의',
            leadingContent: <ContentBadge
                size="xsmall"
                variant="solid"
                className="!bg-primary-60/10 !text-primary-60"
            >#1</ContentBadge>,
        },
        {
            id: 'node3',
            label: '디자인 회의',
            leadingContent: <ContentBadge
                size="xsmall"
                variant="solid"
                className="!bg-primary-60/10 !text-primary-60"
            >#1</ContentBadge>,
        },
    ];

    return (
        <main style={{ padding: 40, maxWidth: 1200 }}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40}}>
                <section>
                    <h2 style={{fontSize: 20, marginBottom: 20}}>DropdownInput</h2>

                    <div style={{marginBottom: 24}}>
                        <DropdownInput
                            heading="참여자"
                            value={selectedPeople}
                            onChange={setSelectedPeople}
                            options={peopleOptions}
                            placeholder="참여자를 선택하세요"
                        />
                    </div>
                </section>

                <section>
                    <h2 style={{fontSize: 20, marginBottom: 20}}>TagInput</h2>

                    <div style={{marginBottom: 24}}>
                        <TagInput
                            nodeInfo={{
                                nodeNumber: 1,
                                nodeTitle: "디자인 회의",
                                nodeType: 'main'
                            }}
                            heading="회의를 진행할 노드"
                        />
                    </div>

                    <div style={{marginBottom: 24}}>
                        <TagInput
                            heading="서브 노드 예시"
                            nodeInfo={{
                                nodeNumber: '1-1',
                                nodeTitle: "프론트엔드 개발 미팅입니다",
                                nodeType: 'sub'
                            }}
                        />
                    </div>
                </section>

                <section>
                    <h2 style={{fontSize: 20, marginBottom: 20}}>MultiSelectInput</h2>

                    <div style={{marginBottom: 24}}>
                        <MultiSelectInput
                            placeholder="@로 사용자나 노드를 참조할 수 있어요."
                            userOptions={userOptions}
                            nodeOptions={nodeOptions}
                            value={chatInput}
                            onChange={setChatInput}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
}
