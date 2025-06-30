package tasteflow.paymentservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tasteflow.paymentservice.model.UrlPayment;
import tasteflow.paymentservice.repository.UrlPaymentRepository;

@Service
public class UrlPaymentService {
    @Autowired
    UrlPaymentRepository urlPaymentRepository;

    public UrlPayment getUrlPayment(int orderId) {
        return urlPaymentRepository.findByorderId(orderId);
    }
}
