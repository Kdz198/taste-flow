package tasteflow.paymentservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tasteflow.paymentservice.model.UrlPayment;
import tasteflow.paymentservice.repository.UrlPaymentRepository;

import java.time.LocalDateTime;

@Service
public class UrlPaymentService {
    @Autowired
    UrlPaymentRepository urlPaymentRepository;

    public UrlPayment getUrlPayment(int orderId) {
        return urlPaymentRepository.findByorderId(orderId);
    }

    //Tự động xóa các url đã hết date mà chưa thanh toán
    @Scheduled(fixedRate = 600000) // 10 phút = 600,000 milliseconds
    @Transactional
    public void cleanExpiredUrls() {
        LocalDateTime now = LocalDateTime.now();
        urlPaymentRepository.deleteByExpiryDateBeforeAndIsUsed(now,false);
    }
}
