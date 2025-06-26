package hoangtugio.org.orderservice2.Service;


import hoangtugio.org.orderservice2.Model.Cart;
import hoangtugio.org.orderservice2.Repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CartService {

    @Autowired
    CartRepository cartRepository;

    public Cart addToCart( int userId,int dishId, int quantity ) {
        Cart cart;
        if ( cartRepository.existsById( userId ) ) {
            cart = cartRepository.findById( userId ).orElse( null );
            Map <Integer,Integer> map = cart.getItems();
            map.put( dishId, map.getOrDefault( dishId, 0) + quantity );
        }
        else
        {
            cart = new Cart();
            cart.setUserId( userId );
            Map <Integer,Integer> map =  new HashMap<>();
            map.put( dishId, quantity );
            cart.setItems( map );
        }
        return cartRepository.save( cart );
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
