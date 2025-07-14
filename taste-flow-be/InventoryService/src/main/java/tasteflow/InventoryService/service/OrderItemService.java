package tasteflow.InventoryService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tasteflow.InventoryService.model.OrderItem;
import tasteflow.InventoryService.repository.OrderItemRepository;

import java.util.List;

@Service
public class OrderItemService {
    @Autowired
    private OrderItemRepository orderItemRepository;

    public void save(OrderItem orderItem) {
        orderItemRepository.save(orderItem);
    }

    public List<OrderItem> findAll() {
        return orderItemRepository.findAll();
    }

    public OrderItem findById(int id) {
        return orderItemRepository.findById(id).get();
    }

    public void delete(int id) {
        orderItemRepository.deleteById(id);
    }

    public List<OrderItem> findByInventoryOrder_Id(int id) {
        return orderItemRepository.getByInventoryOrder_Id(id);
    }

    public List<OrderItem> findByOrder(int orderId) {
        return orderItemRepository.getByInventoryOrder_OrderId(orderId);
    }

    public void deleteByInventoryOrder_Id(int id) {
        System.out.println(id);
            orderItemRepository.deleteByInventoryOrder_Id(id);
    }

}
