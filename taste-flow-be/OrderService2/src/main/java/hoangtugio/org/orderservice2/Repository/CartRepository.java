package hoangtugio.org.orderservice2.Repository;

import hoangtugio.org.orderservice2.Model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Integer> {
}
