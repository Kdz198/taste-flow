package tasteflow.InventoryService.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Data
@Getter
@Setter
public class OrderDTO {
    private int orderId;
    private int userId;
    private double totalAmount;
    private String status;
    private String deliveryAddress;
    private int paymentId;
    private String discountCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
