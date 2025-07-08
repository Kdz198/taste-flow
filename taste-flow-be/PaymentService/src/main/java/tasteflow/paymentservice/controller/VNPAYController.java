package tasteflow.paymentservice.controller;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tasteflow.paymentservice.RabbitMQ.Producer;
import tasteflow.paymentservice.model.Payment;
import tasteflow.paymentservice.service.PaymentService;
import tasteflow.paymentservice.service.VNPAYService;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/vnpay")
public class VNPAYController {

    @Autowired
    VNPAYService vnpayService;

    @Autowired
    PaymentService paymentService;

    @Autowired
    private Producer producer;


    @GetMapping()
    public String getVnpay(@RequestParam String id, @RequestParam int price, String bankCode) throws UnsupportedEncodingException {
        String paymentUrl = vnpayService.createVnpayUrl(id, price,bankCode);
        return paymentUrl;
    }


    @GetMapping("/vnpay-return")
    public String handleVnPayReturn(@RequestParam Map<String, String> params, HttpServletResponse httpResponse) throws Exception {
        Map<String, Object> response = new HashMap<>();

        // Lấy các thông tin quan trọng từ VNPay
        String vnp_Amount = params.get("vnp_Amount");
        String vnp_BankCode = params.get("vnp_BankCode");
        String vnp_BankTranNo = params.get("vnp_BankTranNo");
        String vnp_CardType = params.get("vnp_CardType");
        String vnp_OrderInfo = params.get("vnp_OrderInfo");
        String vnp_PayDate = params.get("vnp_PayDate");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        String vnp_TransactionNo = params.get("vnp_TransactionNo");
        String vnp_TransactionStatus = params.get("vnp_TransactionStatus");
        String vnp_TxnRef = params.get("vnp_TxnRef");
        String vnp_SecureHash = params.get("vnp_SecureHash");

        // Kiểm tra mã phản hồi để xác định thanh toán có thành công hay không
        boolean isSuccess = "00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus);

        // Tạo dữ liệu để gửi về frontend
        response.put("orderId", vnp_TxnRef);
        response.put("amount", Integer.parseInt(vnp_Amount) / 100);
        response.put("bankCode", vnp_BankCode);
        response.put("bankTransactionNo", vnp_BankTranNo);
        response.put("cardType", vnp_CardType);
        response.put("orderInfo", vnp_OrderInfo);
        response.put("payDate", vnp_PayDate);
        response.put("transactionNo", vnp_TransactionNo);
        response.put("status", isSuccess ? "SUCCESS" : "FAILED");

        // Lấy paymentId từ vnp_OrderInfo
        String[] parts = vnp_OrderInfo.split(":");
        String paymentId = parts[1];

        System.out.println("paymentId: " + paymentId);

        // Cập nhật trạng thái thanh toán vào database + gửi hoóa đơn vào mail + tạo notification + dissable url
        if (isSuccess) {
            Payment payment = paymentService.getPaymentById(Integer.parseInt(paymentId));
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            payment.setTransactionId(vnp_TransactionNo);
            payment.setPaymentMethod(Payment.PaymentMethod.VNPAY);
            paymentService.updatePayment(payment);
            producer.confirmPayment(payment.getOrderId(), payment.getId());

        } else {
            System.out.println("Thanh toan cancle");
        }

        // Redirect về frontend với thông tin giao dịch qua query parameters
        //String redirectUrl = "https://swp-301.vercel.app/payment-return?"
        String redirectUrl = ""
                + "status=" + (isSuccess ? "SUCCESS" : "FAILED")
                + "&orderId=" + vnp_TxnRef
                + "&amount=" + (Integer.parseInt(vnp_Amount) / 100)
                + "&bankCode=" + vnp_BankCode
                + "&bankTransactionNo=" + (vnp_BankTranNo != null ? vnp_BankTranNo : "")
                + "&cardType=" + (vnp_CardType != null ? vnp_CardType : "")
                + "&orderInfo=" + URLEncoder.encode(vnp_OrderInfo, StandardCharsets.UTF_8.toString())
                + "&payDate=" + vnp_PayDate
                + "&transactionNo=" + vnp_TransactionNo;

        //httpResponse.sendRedirect(redirectUrl);
        return redirectUrl;
    }
}
