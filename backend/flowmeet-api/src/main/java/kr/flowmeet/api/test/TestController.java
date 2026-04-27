package kr.flowmeet.api.test;

import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.auth.jwt.JwtProvider;
import kr.flowmeet.domain.user.entity.User;
import kr.flowmeet.domain.user.repository.UserRepository;
import kr.flowmeet.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Profile("local")
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {

    private final JwtProvider jwtProvider;
    private final UserService userService;

    @GetMapping("/token")
    public CommonResponse<String> issueToken(@RequestParam Long userId) {
        User user = userService.findById(userId);

        String token = jwtProvider.generateToken(user.getId(), user.getEmail(), user.getNickname());
        return CommonResponse.ok(token);
    }

    @GetMapping("/token/template")
    public CommonResponse<String> issueToken(
            @RequestParam Long userId,
            @RequestParam String email,
            @RequestParam String nickname
    ) {
        String token = jwtProvider.generateToken(userId, email, nickname);
        return CommonResponse.ok(token);
    }
}