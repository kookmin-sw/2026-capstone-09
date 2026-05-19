package kr.flowmeet.mcpserver.tool;

import java.util.HashMap;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.http.MediaType;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class NodeTools {

    private final RestClient backendRestClient;

    @Tool(name = "create_node", description = "프로젝트에 새로운 노드를 생성합니다. type 값: MAIN(최상위 노드), SUB(하위 노드, parentId 필수).")
    public String createNode(Long projectId, String title, String type, @Nullable String description, @Nullable Long parentId) {
        Map<String, Object> body = new HashMap<>();
        body.put("title", title);
        body.put("type", type);
        if (description != null) body.put("description", description);
        if (parentId != null) body.put("parentId", parentId);

        return backendRestClient.post()
                .uri("/v1/projects/{projectId}/nodes", projectId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "get_edges", description = "프로젝트 내 연결선 목록을 조회합니다. 각 연결선의 edgeId, startNodeId, endNodeId를 반환합니다. 연결선 삭제 시 edgeId를 찾는 데 사용하세요.")
    public String getEdges(Long projectId) {
        return backendRestClient.get()
                .uri("/v1/projects/{projectId}/edges", projectId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "get_nodes", description = "프로젝트 내 전체 노드 목록을 조회합니다. 각 노드의 nodeId, 제목, 상태를 확인할 수 있습니다. 노드 제목으로 nodeId를 찾아야 할 때 사용하세요.")
    public String getNodes(Long projectId) {
        return backendRestClient.get()
                .uri("/v1/projects/{projectId}/nodes/list", projectId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "get_node", description = "특정 노드의 상세 정보를 조회합니다. 노드의 제목, 설명, 진행 상태, 담당자, 태그, 연결된 회의 정보 등을 확인할 수 있습니다.")
    public String getNode(Long projectId, Long nodeId) {
        return backendRestClient.get()
                .uri("/v1/projects/{projectId}/nodes/{nodeId}", projectId, nodeId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "update_node_title", description = "프로젝트 내 특정 노드의 제목을 수정합니다.")
    public String updateNodeTitle(Long projectId, Long nodeId, String title) {
        return backendRestClient.patch()
                .uri("/v1/projects/{projectId}/nodes/{nodeId}/title", projectId, nodeId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("title", title))
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "update_node_description", description = "프로젝트 내 특정 노드의 설명을 수정합니다.")
    public String updateNodeDescription(Long projectId, Long nodeId, String description) {
        return backendRestClient.patch()
                .uri("/v1/projects/{projectId}/nodes/{nodeId}/description", projectId, nodeId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("description", description))
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "update_node_status", description = "프로젝트 내 특정 노드의 상태를 수정합니다. 가능한 값: WAITING, IN_PROGRESS, DONE")
    public String updateNodeStatus(Long projectId, Long nodeId, String status) {
        return backendRestClient.patch()
                .uri("/v1/projects/{projectId}/nodes/{nodeId}/status", projectId, nodeId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("status", status))
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "add_assignee", description = "특정 노드에 담당자를 추가합니다. 담당자로 지정할 사용자는 해당 프로젝트의 멤버여야 합니다.")
    public String addAssignee(Long projectId, Long nodeId, Long userId) {
        return backendRestClient.post()
                .uri("/v1/projects/{projectId}/nodes/{nodeId}/assignees", projectId, nodeId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("userId", userId))
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "create_edge", description = "두 노드 사이에 연결선을 생성합니다.")
    public String createEdge(Long projectId, Long startNodeId, Long endNodeId, @Nullable String comment) {
        Map<String, Object> body = new HashMap<>();
        body.put("startNodeId", startNodeId);
        body.put("endNodeId", endNodeId);
        if (comment != null) body.put("comment", comment);

        return backendRestClient.post()
                .uri("/v1/projects/{projectId}/edges", projectId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);
    }

    @Tool(name = "delete_edge", description = "두 노드 사이의 연결선을 삭제합니다.")
    public String deleteEdge(Long projectId, Long edgeId) {
        var response = backendRestClient.delete()
                .uri("/v1/projects/{projectId}/edges/{edgeId}", projectId, edgeId)
                .header("Authorization", ToolAuthExtractor.extractAuth())
                .retrieve()
                .toEntity(String.class);
        return response.getBody() != null ? response.getBody() : "삭제 완료";
    }

}