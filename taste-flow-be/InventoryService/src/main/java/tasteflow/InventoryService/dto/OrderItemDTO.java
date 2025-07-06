package tasteflow.InventoryService.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.query.Order;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class OrderItemDTO {
    private int orderItemId;
    private OrderDTO order;
    private String dishId;
    private int quantity;
    private double unitPrice;
    private double subtotal;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
