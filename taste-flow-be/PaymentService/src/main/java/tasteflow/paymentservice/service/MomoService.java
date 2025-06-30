package tasteflow.paymentservice.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class MomoService {

    private static final String PARTNER_CODE = "MOMO";
    private static final String ACCESS_KEY = "F8BBA842ECF85";
    private static final String SECRET_KEY = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    private static final String REDIRECT_URL = "http://localhost:8085/api/momo/momo-return";
    private static final String IPN_URL = "https://callback.url/notify";
    //private static final String REQUEST_TYPE = "captureWallet";
    private static final String REQUEST_TYPE = "payWithMethod";

    public String createPaymentRequest(long amount,String paymentId) throws Exception {

        // Generate requestId and orderId
        String requestId = UUID.randomUUID().toString();
        String orderId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toán đơn hàng:"+ paymentId;
        String extraData = "extra data";

        // Generate raw signature
        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                ACCESS_KEY, amount, extraData, IPN_URL, orderId, orderInfo, PARTNER_CODE, REDIRECT_URL,
                requestId, REQUEST_TYPE);

        // Sign with HMAC SHA256
        String signature = signHmacSHA256(rawSignature, SECRET_KEY);
        System.out.println("Generated Signature: " + signature);

        MomoPaymentRequest requestBody = new MomoPaymentRequest(
                PARTNER_CODE,
                ACCESS_KEY,
                requestId,
                amount,
                orderId,
                orderInfo,
                REDIRECT_URL,
                IPN_URL,
                extraData,
                REQUEST_TYPE,
                signature,
                "en"
        );

        //Config header theo dung format cua Momo
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAcceptCharset(List.of(StandardCharsets.UTF_8));

        // Create HTTP entity with record
        HttpEntity<MomoPaymentRequest> entity = new HttpEntity<>(requestBody, headers);

        // Send POST request
        ResponseEntity<String> response = restTemplate.postForEntity(
                "https://test-payment.momo.vn/v2/gateway/api/create",
                entity,
                String.class
        );
        MomoPaymentResponse paymentResponse = new ObjectMapper().readValue(response.getBody(), MomoPaymentResponse.class);
        return paymentResponse.payUrl;
    }

    // HMAC SHA256 signing method
    private static String signHmacSHA256(String data, String key) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKey);
        byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1)
                hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public record MomoPaymentResponse(
            String partnerCode,
            String orderId,
            String requestId,
            long amount,
            long responseTime,
            String message,
            int resultCode,
            String payUrl,
            String shortLink
    ) {}

    public record MomoPaymentRequest(
            String partnerCode,
            String accessKey,
            String requestId,
            long amount,
            String orderId,
            String orderInfo,
            String redirectUrl,
            String ipnUrl,
            String extraData,
            String requestType,
            String signature,
            String lang
    ) {}
}
