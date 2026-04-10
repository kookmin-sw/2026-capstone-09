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
    label?: string;
    disabled?: boolean;
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const TagInput = ({
                              nodeInfo,
                              label,
                              disabled = true,
                              width = '100%',
                              height,
                              className,
                          }: TagInputProps) => {
    return (
        <FormField gap="8px">
            {label && (
                <FormLabel
                    htmlFor="nodename"
                    variant="label1"
                    weight="regular"
                    sx={(theme: Theme) => ({
                        color: theme.semantic.label.neutral,
                    })}
                >
                    {label}
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
                    height={height || '48px'}
                    sx={{
                        '& input': {
                            fontWeight: 400,
                        }
                    }}
                    leadingContent={
                        <TextFieldContent variant="badge">
                            {nodeInfo.nodeType === 'main' ? (
                                <ContentBadge
                                    size="xsmall"
                                    variant="solid"
                                    color="accent"
                                    accentColor="semantic.primary.normal"
                                    className="!bg-primary-60/10 !text-primary-60"
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