package kr.flowmeet.auth.security;

import java.util.Collections;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class UserAuthentication extends UsernamePasswordAuthenticationToken {

    private UserAuthentication(final Long userId) {
        super(userId, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
    }

    public static UserAuthentication create(final Long userId) {
        return new UserAuthentication(userId);
    }
}
