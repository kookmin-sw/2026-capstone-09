package kr.flowmeet.api.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.common.swagger.ApiErrorCode;
import kr.flowmeet.api.notification.dto.request.UpdateNotificationSettingRequest;
import kr.flowmeet.api.notification.dto.response.GetNotificationSettingResponse;
import kr.flowmeet.auth.annotation.UserId;
import kr.flowmeet.domain.notification.exception.NotificationErrorCode;

@Tag(name = "NotificationSetting", description = "알림 설정")
public interface NotificationSettingApi {

    @Operation(summary = "프로젝트별 알림 설정 조회")
    @ApiErrorCode(code = NotificationErrorCode.class, names = {"NOTIFICATION_SETTING_NOT_FOUND"})
    CommonResponse<GetNotificationSettingResponse> getNotificationSetting(
            @UserId Long userId, @PathVariable Long projectId);

    @Operation(summary = "프로젝트별 알림 설정 수정", description = "변경할 필드만 전달합니다.")
    @ApiErrorCode(code = NotificationErrorCode.class, names = {"NOTIFICATION_SETTING_NOT_FOUND"})
    CommonResponse<GetNotificationSettingResponse> updateNotificationSetting(
            @UserId Long userId, @PathVariable Long projectId,
            @RequestBody UpdateNotificationSettingRequest request);
}