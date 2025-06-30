package tasteflow.paymentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tasteflow.paymentservice.model.UrlPayment;

import java.time.LocalDateTime;

public interface UrlPaymentRepository extends JpaRepository<UrlPayment, Integer> {
    UrlPayment findByorderId(int orderId);

    void deleteByExpiryDateBeforeAndIsUsed(LocalDateTime expiryDate, boolean isUsed);
}
