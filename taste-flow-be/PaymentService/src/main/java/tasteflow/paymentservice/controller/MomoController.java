package tasteflow.paymentservice.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tasteflow.paymentservice.model.Payment;
import tasteflow.paymentservice.service.PaymentService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/momo")
public class MomoController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/momo-return")
    public ResponseEntity<Map<String, Object>> handleMomoReturn(@RequestParam Map<String, String> params) {
        Map<String, Object> response = new HashMap<>(params);

        // Trích xuất các thuộc tính từ params
        String partnerCode = params.get("partnerCode");
        String orderId = params.get("orderId");
        String requestId = params.get("requestId");
        String amount = params.get("amount");
        String orderInfo = params.get("orderInfo");
        String orderType = params.get("orderType");
        String transId = params.get("transId");
        String resultCode = params.get("resultCode");
        String message = params.get("message");
        String payType = params.get("payType");
        String responseTime = params.get("responseTime");
        String extraData = params.get("extraData");
        String signature = params.get("signature");

        // Lấy paymentId từ vnp_OrderInfo
        String[] parts = orderInfo.split(":");
        String paymentId = parts[1];

        System.out.println("paymentId: " + paymentId);

        if (message.equals("Successful.")) {
            Payment payment = paymentService.getPaymentById(Integer.parseInt(paymentId));
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            payment.setTransactionId(transId);
            payment.setPaymentMethod(Payment.PaymentMethod.MOMO);
            paymentService.updatePayment(payment);
        }
        else
        {
            System.out.println("Thanh toan cancle");
        }

        //o day redirect ve FE voi parameter de hien thi hoa don
        return ResponseEntity.ok(response);
    }
}
