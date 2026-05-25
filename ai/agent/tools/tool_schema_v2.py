tool_schema = [
    {
        "name": "get_flowchart",
        "description": "프로젝트의 플로우차트를 조회합니다. 전체 노드 목록과 노드 간 연결선(엣지) 목록을 반환합니다. 엣지에는 edgeId, startNodeId, endNodeId가 포함되어 있어 연결선 삭제 시 edgeId를 찾는 데 사용하세요.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "조회할 프로젝트의 ID"}
            },
            "required": [],
            "additionalProperties": False
        }
    },
    {
        "name": "get_nodes",
        "description": "프로젝트 내 전체 노드 목록을 조회합니다. 각 노드의 nodeId, 제목, 상태를 확인할 수 있습니다. 노드 제목으로 nodeId를 찾아야 할 때 사용하세요.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "조회할 프로젝트의 ID"}
            },
            "required": [],
            "additionalProperties": False
        }
    },
    {
        "name": "get_project_members",
        "description": "프로젝트의 멤버 목록을 조회합니다. 각 멤버의 userId, 이메일, 닉네임, 역할(OWNER/MEMBER/VIEWER)을 반환합니다. 회의 생성 시 참가자 userId를 확인하거나, 요청한 사용자가 프로젝트 멤버인지 확인할 때 사용하세요. 멤버가 아닌 경우 먼저 초대를 안내하세요.",
        "input_schema": {
            "type": "object",
            "properties": {
                "projectId": {"type": "integer", "description": "조회할 프로젝트의 ID"}
            },
            "required": [],
            "additionalProperties": False
        }
    }
]