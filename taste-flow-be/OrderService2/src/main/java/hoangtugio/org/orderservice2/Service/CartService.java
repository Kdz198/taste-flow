package hoangtugio.org.orderservice2.Service;


import hoangtugio.org.orderservice2.Controller.CartController;
import hoangtugio.org.orderservice2.Model.Cart;
import hoangtugio.org.orderservice2.Repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class CartService {

    @Autowired
    CartRepository cartRepository;


    @Transactional
    public Cart addToCart(int userId, Map<Integer, Integer> itemsToAdd) {
        Cart cart;
        if (cartRepository.existsById(userId)) {

            cart = cartRepository.findById(userId).orElseThrow(() -> new RuntimeException("Cart not found"));
            Map<Integer, Integer> existingItems = cart.getItems();

            // Merge new items into existing cart
            for (Map.Entry<Integer, Integer> entry : itemsToAdd.entrySet()) {
                int dishId = entry.getKey();
                int quantity = entry.getValue();
                existingItems.put(dishId, existingItems.getOrDefault(dishId, 0) + quantity);
            }
        } else {
            cart = new Cart();
            cart.setUserId(userId);
            cart.setItems(new HashMap<>(itemsToAdd));
        }

        return cartRepository.save(cart);
    }

    public Cart removeFromCart( int userId, Map<Integer, Integer> itemsToRemove ) {
        Cart cart = cartRepository.findById(userId).orElse(null);
        if (cart == null) {
            throw new RuntimeException("Cart not found for userId: " + userId);
        }
        Map <Integer,Integer> map = cart.getItems();
        for ( Integer dishId : itemsToRemove.keySet() ) {
            if ( map.containsKey( dishId ) ) {
                map.put( dishId, map.get( dishId ) -  itemsToRemove.get( dishId ) );
                if ( map.get( dishId ) == 0 )
                    map.remove( dishId );
            }
        }
        cart.setItems( map );
        return cartRepository.save( cart );

    }



}
