'use client';

import { FormField, FormLabel, FormControl, TextField, TextFieldContent, ContentBadge } from '@wanteddev/wds';
import type { Theme } from '@wanteddev/wds-engine';

export interface NodeInfo {
  nodeNumber: string | number;
  nodeTitle: string;
  nodeType: 'main' | 'sub';
}

export interface TagInputProps {
    nodeInfo: NodeInfo;
    heading?: string;
    disabled?: boolean;
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const TagInput = ({
    nodeInfo,
    heading,
    disabled = true,
    width = '100%',
    height,
    className,
}: TagInputProps) => {
    return (
        <FormField className="gap-2">
            {heading && (
                <FormLabel
                    htmlFor="nodename"
                    variant="label1"
                    weight="bold"
                    sx={(theme: Theme) => ({
                        color: theme.semantic.label.neutral,
                    })}
                >
                    {heading}
                </FormLabel>
            )}
            <FormControl>
                <TextField
                    id="nodename"
                    className={className}
                    value={nodeInfo.nodeTitle}
                    disabled={disabled}
                    readOnly
                    width={width}
                    height={height}
                    leadingContent={
                        <TextFieldContent variant="badge">
                            {nodeInfo.nodeType === 'main' ? (
                                <ContentBadge
                                    size="xsmall"
                                    variant="solid"
                                    className="!bg-primary-40/10 !text-primary-40"
                                >
                                    #{nodeInfo.nodeNumber}
                                </ContentBadge>
                            ) : (
                                <ContentBadge
                                    size="xsmall"
                                    variant="outlined"
                                    color="neutral"
                                >
                                    #{nodeInfo.nodeNumber}
                                </ContentBadge>
                            )}
                        </TextFieldContent>
                    }
                />
            </FormControl>
        </FormField>
    );
};

TagInput.displayName = 'TagInput';