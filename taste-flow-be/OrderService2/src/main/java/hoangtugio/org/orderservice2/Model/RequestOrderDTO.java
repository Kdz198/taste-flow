package hoangtugio.org.orderservice2.Model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestOrderDTO {

    @NotNull(message = "Order is mandatory")
    private Order order;

    @NotNull(message = "Items are mandatory")
    @Size(min = 1, message = "At least one item is required")
    List<OrderItem> orderItemList;


}
