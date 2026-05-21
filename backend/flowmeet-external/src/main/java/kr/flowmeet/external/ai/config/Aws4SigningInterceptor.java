package kr.flowmeet.external.ai.config;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.signer.Aws4Signer;
import software.amazon.awssdk.auth.signer.params.Aws4SignerParams;
import software.amazon.awssdk.http.SdkHttpFullRequest;
import software.amazon.awssdk.http.SdkHttpMethod;
import software.amazon.awssdk.regions.Region;

@RequiredArgsConstructor
public class Aws4SigningInterceptor implements ClientHttpRequestInterceptor {

    private static final String SIGNING_NAME = "execute-api";
    private static final Region SIGNING_REGION = Region.AP_NORTHEAST_2;

    private final AwsCredentialsProvider credentialsProvider;

    @Override
    public ClientHttpResponse intercept(final HttpRequest request, final byte[] body,
            final ClientHttpRequestExecution execution) throws IOException {

        SdkHttpFullRequest signedRequest = sign(request, body);

        signedRequest.headers().forEach((key, values) -> {
            if (!"Host".equalsIgnoreCase(key)) {
                values.forEach(value -> request.getHeaders().set(key, value));
            }
        });

        return execution.execute(request, body);
    }

    private SdkHttpFullRequest sign(final HttpRequest request, final byte[] body) {
        SdkHttpFullRequest unsignedRequest = SdkHttpFullRequest.builder()
                .method(SdkHttpMethod.fromValue(request.getMethod().name()))
                .uri(request.getURI())
                .contentStreamProvider(() -> new ByteArrayInputStream(body))
                .build();

        Aws4SignerParams signerParams = Aws4SignerParams.builder()
                .awsCredentials(credentialsProvider.resolveCredentials())
                .signingName(SIGNING_NAME)
                .signingRegion(SIGNING_REGION)
                .build();

        return Aws4Signer.create().sign(unsignedRequest, signerParams);
    }
}