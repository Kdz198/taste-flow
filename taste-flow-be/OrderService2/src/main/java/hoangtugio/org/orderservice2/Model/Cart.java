package hoangtugio.org.orderservice2.Model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "carts")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Cart {

    @Id
    @NotNull(message = "User ID is mandatory")
    private int userId;

    //Element để tự động ORM thêm 1 bảng phụ dưới DB
    @ElementCollection
    @CollectionTable(name = "cart_items", joinColumns = @JoinColumn(name = "cart_id"))
    @MapKeyColumn(name = "dish_id")
    @Column(name = "quantity")
    private Map<Integer, Integer> items = new HashMap<>();

    private int quantity;

}