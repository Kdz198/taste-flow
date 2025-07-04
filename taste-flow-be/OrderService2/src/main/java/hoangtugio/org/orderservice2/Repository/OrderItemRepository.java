package hoangtugio.org.orderservice2.Repository;


import hoangtugio.org.orderservice2.Model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
}
