package tasteflow.InventoryService.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tasteflow.InventoryService.model.OrderItem;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> getByInventoryOrder_Id(int id);

    List<OrderItem> getByInventoryOrder_OrderId(int inventoryOrderOrderId);

    public void deleteByInventoryOrder_Id(int inventoryOrderId);
}
