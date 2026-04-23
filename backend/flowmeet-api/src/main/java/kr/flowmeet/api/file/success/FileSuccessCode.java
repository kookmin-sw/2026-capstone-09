package kr.flowmeet.api.file.success;

import kr.flowmeet.common.response.SuccessCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum FileSuccessCode implements SuccessCode {
    CREATE_PRESIGNED_URL("업로드 URL을 발급했어요."),
    CONFIRM_UPLOAD("파일 업로드를 완료했어요."),
    DELETE_FILE("파일을 삭제했어요.");

    private final String message;
}
