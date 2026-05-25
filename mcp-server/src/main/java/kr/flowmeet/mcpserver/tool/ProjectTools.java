package kr.flowmeet.mcpserver.tool;

import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class ProjectTools {

    private final RestClient backendRestClient;

    @Tool(name = "get_project_members", description = "프로젝트의 멤버 목록을 조회합니다. 각 멤버의 userId, 이메일, 닉네임, 역할(OWNER/MEMBER/VIEWER)을 반환합니다. 회의 생성 시 참가자 userId를 확인하거나, 요청한 사용자가 프로젝트 멤버인지 확인할 때 사용하세요. 멤버가 아닌 경우 먼저 초대를 안내하세요.")
    public String getProjectMembers(Long projectId) {
        return backendRestClient.get()
                .uri("/v1/projects/{projectId}/members", projectId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "invite_member", description = "프로젝트에 새로운 멤버를 이메일로 초대합니다. 초대받은 사용자의 이메일로 초대 링크가 전송됩니다.")
    public String inviteMember(Long projectId, String email) {
        return backendRestClient.post()
                .uri("/v1/projects/{projectId}/invite", projectId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("email", email))
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "remove_project_member", description = "프로젝트에서 멤버를 삭제합니다. OWNER 권한을 가진 사용자만 실행할 수 있습니다.")
    public String removeProjectMember(Long projectId, Long memberId) {
        var response = backendRestClient.delete()
                .uri("/v1/projects/{projectId}/members/{memberId}", projectId, memberId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .retrieve()
                .toEntity(String.class);
        return response.getBody() != null ? response.getBody() : "삭제 완료";
    }

}