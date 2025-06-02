package tasteflow.paymentservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tasteflow.paymentservice.model.Discount;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Integer> {
    public boolean existsByCoupon(String coupon);

    Discount findById(int id);
}
