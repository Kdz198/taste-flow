package tasteflow.paymentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tasteflow.paymentservice.model.UrlPayment;

public interface UrlPaymentRepository extends JpaRepository<UrlPayment, Integer> {
    UrlPayment findByorderId(int orderId);
}
