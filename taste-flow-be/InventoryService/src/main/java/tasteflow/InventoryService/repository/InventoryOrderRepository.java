package tasteflow.InventoryService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tasteflow.InventoryService.model.InventoryOrder;
import tasteflow.InventoryService.service.InventoryOrderService;

import java.util.List;

public interface InventoryOrderRepository extends JpaRepository<InventoryOrder, Integer> {
    InventoryOrder findByOrderId(int orderId);

    boolean existsByOrderId(int orderId);
}
