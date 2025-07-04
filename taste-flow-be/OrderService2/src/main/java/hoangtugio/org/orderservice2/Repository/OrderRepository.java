package hoangtugio.org.orderservice2.Repository;

import hoangtugio.org.orderservice2.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}
