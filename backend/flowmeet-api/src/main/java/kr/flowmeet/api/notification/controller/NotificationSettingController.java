package kr.flowmeet.api.notification.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.notification.dto.request.UpdateNotificationSettingRequest;
import kr.flowmeet.api.notification.dto.response.GetNotificationSettingResponse;
import kr.flowmeet.api.notification.facade.NotificationFacade;
import kr.flowmeet.api.notification.success.NotificationSuccessCode;
import kr.flowmeet.auth.annotation.UserId;

@RestController
@RequestMapping("/v1/projects/{projectId}/notification-settings")
@RequiredArgsConstructor
public class NotificationSettingController implements NotificationSettingApi {

    private final NotificationFacade notificationFacade;

    @Override
    @GetMapping
    public CommonResponse<GetNotificationSettingResponse> getNotificationSetting(
            @UserId Long userId,
            @PathVariable Long projectId
    ) {
        return CommonResponse.ok(
                NotificationSuccessCode.GET_NOTIFICATION_SETTING,
                notificationFacade.getNotificationSetting(userId, projectId)
        );
    }

    @Override
    @PatchMapping
    public CommonResponse<GetNotificationSettingResponse> updateNotificationSetting(
            @UserId Long userId,
            @PathVariable Long projectId,
            @RequestBody UpdateNotificationSettingRequest request
    ) {
        return CommonResponse.ok(
                NotificationSuccessCode.UPDATE_NOTIFICATION_SETTING,
                notificationFacade.updateNotificationSetting(userId, projectId, request)
        );
    }
}
