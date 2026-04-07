package kr.flowmeet.api.mock;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import kr.flowmeet.api.mock.dto.CreateMockRequest;
import kr.flowmeet.api.mock.dto.GetAllMocksResponse;
import kr.flowmeet.domain.mock.service.MockService;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.service.UserService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MockFacade {

    private final UserService userService;
    private final MockService mockService;

    @Transactional
    public void createMock(final Long userId, final CreateMockRequest request) {
        User user = userService.findById(userId);

        mockService.create(request.name());
    }

    public GetAllMocksResponse getAllMocks(final Long userId) {
        User user = userService.findById(userId);
        List<String> mocks = mockService.findAll(user);

        return GetAllMocksResponse.of(mocks);
    }
}
