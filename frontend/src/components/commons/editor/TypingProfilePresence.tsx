'use client';

import type { Editor } from '@tiptap/react';
import { useEffect, useState } from 'react';

import type { YjsAwarenessState, YjsContextValue } from '@/contexts/YjsContext';
import { normalizeImageUrl } from '@/utils/normalizeImageUrl';

const AVATAR_SIZE = 24;
const AVATAR_GAP = 16;
const TYPING_PRESENCE_MAX_AGE_MS = 30000;

interface TypingProfilePresenceProps {
  editor: Editor | null;
  yjsCtx: YjsContextValue | null;
  field: string;
}

interface TypingProfile {
  clientId: number;
  nickname: string;
  profileImageUrl: string | null;
  color: string;
  head: number;
}

interface TypingProfilePosition extends TypingProfile {
  top: number;
  left: number;
}

const getInitial = (nickname: string) => nickname.trim().charAt(0) || '?';

const getCurrentUser = (yjsCtx: YjsContextValue | null) =>
  yjsCtx?.provider.awareness.getLocalState() as Partial<YjsAwarenessState> | null;

const setLocalTypingState = (
  yjsCtx: YjsContextValue | null,
  field: string,
  head: number | null,
) => {
  const user = getCurrentUser(yjsCtx)?.user;
  if (!yjsCtx || !user) return;

  yjsCtx.provider.awareness.setLocalStateField('user', {
    ...user,
    typing:
      head === null
        ? null
        : {
            field,
            head,
            updatedAt: Date.now(),
          },
  });
};

const getTypingProfiles = (yjsCtx: YjsContextValue, field: string): TypingProfile[] => {
  const localClientId = yjsCtx.provider.awareness.clientID;
  const now = Date.now();
  const profiles: TypingProfile[] = [];

  yjsCtx.provider.awareness.getStates().forEach((state, clientId) => {
    if (clientId === localClientId) return;

    const user = (state as Partial<YjsAwarenessState>).user;
    const typing = user?.typing;
    if (!user?.nickname || !typing || typing.field !== field) return;
    if (now - typing.updatedAt > TYPING_PRESENCE_MAX_AGE_MS) return;

    profiles.push({
      clientId,
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
      color: user.color,
      head: typing.head,
    });
  });

  return profiles;
};

const getProfilePositions = (
  editor: Editor,
  profiles: TypingProfile[],
): TypingProfilePosition[] => {
  if (editor.isDestroyed) return [];

  try {
    const view = editor.view;
    const container =
      (view.dom.closest('[data-typing-profile-container]') as HTMLElement | null) ??
      view.dom.parentElement ??
      view.dom;
    const containerRect = container.getBoundingClientRect();
    const editorRect = view.dom.getBoundingClientRect();

    return profiles.flatMap((profile) => {
      try {
        const docSize = editor.state.doc.content.size;
        const safeHead = Math.max(0, Math.min(profile.head, docSize));
        const coords = view.coordsAtPos(safeHead);

        return [
          {
            ...profile,
            top: coords.top + (coords.bottom - coords.top) / 2 - AVATAR_SIZE / 2 - containerRect.top,
            // 컨테이너 왼쪽 바깥(음수)으로 나가면 상위 overflow에 잘리므로 안쪽으로 클램프한다.
            left: Math.max(
              2,
              editorRect.left - containerRect.left - AVATAR_SIZE - AVATAR_GAP,
            ),
          },
        ];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
};

export function TypingProfilePresence({ editor, yjsCtx, field }: TypingProfilePresenceProps) {
  const [profiles, setProfiles] = useState<TypingProfilePosition[]>([]);

  useEffect(() => {
    if (!editor || !yjsCtx) return;

    const updateLocalTyping = () => {
      if (!editor.isFocused) return;
      setLocalTypingState(yjsCtx, field, editor.state.selection.head);
    };

    const clearLocalTyping = () => setLocalTypingState(yjsCtx, field, null);

    editor.on('focus', updateLocalTyping);
    editor.on('selectionUpdate', updateLocalTyping);
    editor.on('update', updateLocalTyping);
    editor.on('blur', clearLocalTyping);

    return () => {
      clearLocalTyping();
      editor.off('focus', updateLocalTyping);
      editor.off('selectionUpdate', updateLocalTyping);
      editor.off('update', updateLocalTyping);
      editor.off('blur', clearLocalTyping);
    };
  }, [editor, field, yjsCtx]);

  useEffect(() => {
    if (!editor || !yjsCtx) {
      queueMicrotask(() => setProfiles([]));
      return;
    }

    const updateProfiles = () => {
      const typingProfiles = getTypingProfiles(yjsCtx, field);
      setProfiles(getProfilePositions(editor, typingProfiles));
    };

    updateProfiles();
    yjsCtx.provider.awareness.on('change', updateProfiles);
    window.addEventListener('scroll', updateProfiles, true);
    window.addEventListener('resize', updateProfiles);

    return () => {
      yjsCtx.provider.awareness.off('change', updateProfiles);
      window.removeEventListener('scroll', updateProfiles, true);
      window.removeEventListener('resize', updateProfiles);
    };
  }, [editor, field, yjsCtx]);

  return (
    <>
      {profiles.map((profile) => {
        const profileImageUrl = normalizeImageUrl(profile.profileImageUrl ?? undefined);

        return (
          <div
            key={profile.clientId}
            className="border-static-white shadow-normal-small pointer-events-none absolute z-50 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border bg-gray-200"
            style={{ top: profile.top, left: profile.left }}
            title={profile.nickname}
          >
            {profileImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImageUrl}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <span className="text-caption-2 text-label-alternative font-medium">
                {getInitial(profile.nickname)}
              </span>
            )}
          </div>
        );
      })}
    </>
  );
}
