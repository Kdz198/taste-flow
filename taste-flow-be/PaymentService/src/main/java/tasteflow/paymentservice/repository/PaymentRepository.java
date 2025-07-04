package tasteflow.paymentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tasteflow.paymentservice.model.Payment;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByuserId(int userId);

    Payment findByorderId(int orderId);
}
