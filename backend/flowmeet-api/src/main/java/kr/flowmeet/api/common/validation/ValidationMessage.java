package kr.flowmeet.api.common.validation;

public final class ValidationMessage {

    private ValidationMessage() {
    }

    public static final String FILE_KEY_REQUIRED = "파일 키는 필수로 입력해 주세요.";
    public static final String FILE_NAME_REQUIRED = "파일 이름은 필수로 입력해 주세요.";
    public static final String FILE_SIZE_POSITIVE = "파일 크기는 0보다 커야 해요.";
    public static final String FILE_EXTENSION_REQUIRED = "확장자는 필수로 입력해 주세요.";
    public static final String FILE_CONTENT_TYPE_REQUIRED = "콘텐츠 타입은 필수로 입력해 주세요.";

    public static final String NODE_TITLE_REQUIRED = "노드 제목은 필수로 입력해 주세요.";
    public static final String NODE_STATUS_REQUIRED = "상태는 필수로 입력해 주세요.";
    public static final String NODE_SORT_ORDER_REQUIRED = "정렬 순서는 필수로 입력해 주세요.";
    public static final String NODE_SUMMARY_TARGETS_REQUIRED = "요약할 노드를 선택해 주세요.";

    public static final String EDGE_START_NODE_ID_REQUIRED = "시작 노드 ID는 필수로 입력해 주세요.";
    public static final String EDGE_END_NODE_ID_REQUIRED = "종료 노드 ID는 필수로 입력해 주세요.";

    public static final String TAG_ID_REQUIRED = "태그 ID는 필수로 입력해 주세요.";
    public static final String TAG_NAME_REQUIRED = "태그 이름은 필수로 입력해 주세요.";
    public static final String TAG_COLOR_REQUIRED = "태그 색상은 필수로 입력해 주세요.";

    public static final String ASSIGNEE_USER_ID_REQUIRED = "사용자 ID는 필수로 입력해 주세요.";

    public static final String PROJECT_NAME_REQUIRED = "프로젝트 이름은 필수로 입력해 주세요.";
    public static final String PROJECT_URL_REQUIRED = "URL은 필수로 입력해 주세요.";
    public static final String PROJECT_URL_NAME_REQUIRED = "URL 이름은 필수로 입력해 주세요.";
    public static final String PROJECT_MEMBER_ROLE_REQUIRED = "역할은 필수로 입력해 주세요.";
    public static final String INVITATION_TOKEN_REQUIRED = "초대 토큰은 필수로 입력해 주세요.";

    public static final String EMAIL_REQUIRED = "이메일은 필수로 입력해 주세요.";
    public static final String EMAIL_INVALID = "이메일 형식을 다시 확인해 주세요.";
    public static final String EMAIL_VERIFICATION_CODE_REQUIRED = "인증 코드는 필수로 입력해 주세요.";

    public static final String NICKNAME_REQUIRED = "닉네임은 필수로 입력해 주세요.";
    public static final String NICKNAME_MAX_LENGTH = "닉네임은 최대 20자까지 입력할 수 있어요.";

    public static final String MEETING_STARTED_AT_REQUIRED = "회의 시작 시간은 필수로 입력해 주세요.";
    public static final String MEETING_PARTICIPANTS_REQUIRED = "참여자는 필수로 입력해 주세요.";
}
