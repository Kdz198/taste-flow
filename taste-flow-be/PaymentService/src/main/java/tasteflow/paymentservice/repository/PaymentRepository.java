package tasteflow.paymentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tasteflow.paymentservice.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Payment findByuserId(int userId);
}
