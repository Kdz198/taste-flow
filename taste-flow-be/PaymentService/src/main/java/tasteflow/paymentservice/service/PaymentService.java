package tasteflow.paymentservice.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tasteflow.paymentservice.exception.CustomException;
import tasteflow.paymentservice.model.Payment;
import tasteflow.paymentservice.model.UrlPayment;
import tasteflow.paymentservice.repository.PaymentRepository;
import tasteflow.paymentservice.repository.UrlPaymentRepository;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private VNPAYService vnpayService;
    @Autowired
    MomoService momoService;
    @Autowired
    DiscountService discountService;
    @Autowired
    private UrlPaymentRepository urlPaymentRepository;

    public Payment processPayment(Payment payment) throws Exception {

        String url ="";
        int total = payment.getAmount();

        // Cần lấy orderId ra, check xem có phải là KH nó thah toán lại hay ko hay cái này lần đầu xuất hiện dưới DB

        Payment existPayment = paymentRepository.findByorderId(payment.getOrderId());
        if (existPayment != null) {

            // cái nào success rồi ko cho thanh toán lại
            payment.setId(existPayment.getId());
            if (existPayment.getStatus() == Payment.PaymentStatus.SUCCESS) {
                throw new CustomException("Hóa đơn đã được thanh toán ", HttpStatus.BAD_REQUEST);
            }
        }
        // bỏ vào DB payment trước sau đó mới gọi VNPAY/Momo để tạo url thanh toán
        if (payment.getDiscountCode() == null)
        {
            System.out.println("discount deo co");

        }
        else
        {
            //Neu co discountId thi set discount cho cai payment
            payment.setDiscountValue(discountService.findByDiscountCode(payment.getDiscountCode()).getDiscount());

            total = payment.getAmount() - payment.getAmount()/100*discountService.findByDiscountCode(payment.getDiscountCode()).getDiscount();
        }

        if (payment.getPaymentMethod() == Payment.PaymentMethod.VNPAY) {
            url = vnpayService.createVnpayUrl(String.valueOf(payment.getId()), total, "");
        }
        else if (payment.getPaymentMethod() == Payment.PaymentMethod.MOMO)
        {
            url = momoService.createPaymentRequest(total, String.valueOf(payment.getId()));
        }

        payment.setStatus(Payment.PaymentStatus.PENDING);
        // Đè luôn URL payment cũ trong trường hợp thanh toán lại
        UrlPayment urlPayment = new UrlPayment(payment.getOrderId(), url,false, LocalDateTime.now().plusMinutes(10));
        urlPaymentRepository.save(urlPayment);
        return paymentRepository.save(payment);
    }






    public Payment updatePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment getPaymentById(int id) {
        return paymentRepository.findById(id).orElseThrow();
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentHistoryByUser (int userId) {
        return paymentRepository.findByuserId(userId);
    }
}
