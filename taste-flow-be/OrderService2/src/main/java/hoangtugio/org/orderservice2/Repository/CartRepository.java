package hoangtugio.org.orderservice2.Repository;

import hoangtugio.org.orderservice2.Model.Cart;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Cart findByUserId(@NotNull(message = "User ID is mandatory") int userId);
}
