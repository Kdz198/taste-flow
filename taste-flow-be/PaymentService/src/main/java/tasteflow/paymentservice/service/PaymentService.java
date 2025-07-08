package tasteflow.paymentservice.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tasteflow.paymentservice.exception.CustomException;
import tasteflow.paymentservice.model.Payment;
import tasteflow.paymentservice.repository.PaymentRepository;

import java.util.List;
import java.util.Optional;

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

    public Payment processPayment(Payment payment) throws Exception {
        Payment p = paymentRepository.findByorderId(payment.getOrderId());
        if (p != null) {
            payment.setId(p.getId());
        }

        payment.setStatus(Payment.PaymentStatus.PENDING);
        return paymentRepository.save(payment);
    }

    public String confirmPayment (int orderId, String paymentMethod, String discountCode) throws Exception {
        String url ="";

        Payment payment = paymentRepository.findByorderId(orderId);
        int total = payment.getAmount();
        if (payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
            throw new CustomException("Hóa đơn đã được thanh toán ", HttpStatus.CONFLICT);
        }

        if (!discountCode.trim().isEmpty())
        {
            //Neu co discountId thi set discount cho cai payment
            payment.setDiscountValue(discountService.findByDiscountCode(discountCode).getDiscount());
            total = payment.getAmount() - payment.getAmount()/100*discountService.findByDiscountCode(discountCode).getDiscount();
            payment.setDiscountCode(discountCode);
        }
        else
        {
            payment.setDiscountCode(null);
            payment.setDiscountValue(0);
        }

        if (paymentMethod.equals("VNPAY")) {

            url = vnpayService.createVnpayUrl(String.valueOf(payment.getId()), total, "");
            payment.setPaymentMethod(Payment.PaymentMethod.VNPAY);

        }
        else if (paymentMethod.equals("MOMO"))
        {
            url = momoService.createPaymentRequest(total, String.valueOf(payment.getId()),orderId);
            payment.setPaymentMethod(Payment.PaymentMethod.MOMO);
        }

        paymentRepository.save(payment);
        return url;
    }






    public Payment updatePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment getPaymentById(int id) {
        return paymentRepository.findById(id).orElseThrow();
    }

    public Optional<Payment> getPaymentByOrderId(int orderId) {
        return Optional.ofNullable(paymentRepository.findByorderId(orderId));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentHistoryByUser (int userId) {
        return paymentRepository.findByuserId(userId);
    }
}
