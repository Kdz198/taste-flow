package tasteflow.paymentservice.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tasteflow.paymentservice.model.Payment;
import tasteflow.paymentservice.repository.PaymentRepository;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private VNPAYService vnpayService;

    public Payment processPayment(Payment payment) {

        payment.setStatus(Payment.PaymentStatus.PENDING);

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
