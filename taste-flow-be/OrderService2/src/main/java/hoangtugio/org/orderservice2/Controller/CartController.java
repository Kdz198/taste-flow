package hoangtugio.org.orderservice2.Controller;

import hoangtugio.org.orderservice2.Model.Cart;
import hoangtugio.org.orderservice2.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping()
    public Cart addToCart (@RequestBody addToCartRequest addToCartRequest) {
        return cartService.addToCart( addToCartRequest.userId,addToCartRequest.itemsToAdd );
    }

    public record addToCartRequest(
            int userId,
            Map<Integer, Integer> itemsToAdd
    ) {}


    public record RemoveCartRequest(
            int userId,
            Map<Integer, Integer> itemsToRemove
    ) {}

    @DeleteMapping
    public Cart removeFromCart (@RequestBody RemoveCartRequest request) {
        Cart updatedCart = cartService.removeFromCart(request.userId(), request.itemsToRemove());
        return updatedCart;
    }
}
