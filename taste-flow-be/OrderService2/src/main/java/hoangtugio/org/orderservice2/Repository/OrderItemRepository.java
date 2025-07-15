package hoangtugio.org.orderservice2.Repository;


import hoangtugio.org.orderservice2.Model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrderOrderId(int orderId);

}
