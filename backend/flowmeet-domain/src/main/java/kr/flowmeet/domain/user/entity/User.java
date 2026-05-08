package kr.flowmeet.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import kr.flowmeet.domain.common.BaseTimeEntity;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_provider_social_id", columnNames = {"social_provider", "social_id"}),
                @UniqueConstraint(name = "uk_users_email", columnNames = "email")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE user_id = ?")
@SQLRestriction("deleted_at IS NULL")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "social_provider", nullable = false, length = 32)
    private SocialProvider socialProvider;

    @Column(name = "social_id", nullable = false)
    private String socialId;

    @Column(name = "social_email", nullable = false)
    private String socialEmail;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(nullable = false)
    private String nickname;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "google_refresh_token", length = 512)
    private String googleRefreshToken;

    @Builder
    public User(SocialProvider socialProvider, String socialId, String socialEmail, String email,
                String nickname, String profileImageUrl) {
        this.socialProvider = socialProvider;
        this.socialId = socialId;
        this.socialEmail = socialEmail;
        this.email = email;
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }

    public void updateNickname(final String nickname) {
        this.nickname = nickname;
    }

    public void updateEmail(final String email) {
        this.email = email;
    }

    public void updateProfileImageUrl(final String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public void updateGoogleRefreshToken(final String googleRefreshToken) {
        this.googleRefreshToken = googleRefreshToken;
    }
}
