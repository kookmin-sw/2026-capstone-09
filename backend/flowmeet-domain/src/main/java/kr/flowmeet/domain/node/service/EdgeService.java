package kr.flowmeet.domain.node.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.domain.node.entity.Edge;
import kr.flowmeet.domain.node.repository.EdgeRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EdgeService {

    private final EdgeRepository edgeRepository;

    public List<Edge> findAllByProjectId(final Long projectId) {
        return edgeRepository.findAllByProjectId(projectId);
    }
}
