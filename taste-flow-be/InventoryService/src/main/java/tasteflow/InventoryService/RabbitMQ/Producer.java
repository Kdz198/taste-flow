package tasteflow.InventoryService.RabbitMQ;


import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Producer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public record InventoryStatus(int orderId, String status) {}

    public void checkInventory (int orderId, boolean available) {
        String status = available ? "Available" : "Out_Of_Stock";
        InventoryStatus inventoryStatus = new InventoryStatus(orderId, status);
        System.out.println("Sending: " + inventoryStatus);
        rabbitTemplate.convertAndSend("inventory.exchange", "inventory.checked", inventoryStatus);
    }

    public void unLockInventory ( int orderId) {
        System.out.println("UnLock Order: " + orderId);
        rabbitTemplate.convertAndSend("inventory.exchange", "inventory.unlocked", orderId);

    }
}
