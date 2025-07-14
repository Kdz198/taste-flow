package tasteflow.InventoryService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private int id;
    @Column(name = "OrderId")
    private int orderId;

    @Column(name = "ReceivedAt")
    private Timestamp receivedAt;

    public InventoryOrder(int orderId, Timestamp receivedAt) {
        this.orderId = orderId;
        this.receivedAt = receivedAt;
    }
}
