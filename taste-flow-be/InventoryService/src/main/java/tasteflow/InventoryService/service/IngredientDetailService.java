package tasteflow.InventoryService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import tasteflow.InventoryService.dto.*;
import tasteflow.InventoryService.exception.CustomException;
import tasteflow.InventoryService.model.Ingredient;
import tasteflow.InventoryService.model.IngredientDetail;
import tasteflow.InventoryService.model.InventoryOrder;
import tasteflow.InventoryService.model.OrderItem;
import tasteflow.InventoryService.repository.IngredientDetailRepository;
import tasteflow.InventoryService.repository.InventoryOrderRepository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class IngredientDetailService {
    @Autowired
    private IngredientDetailRepository repo;
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    @Autowired
    private IngredientService ingredientService;
    @Autowired
    private MenuService menuService;
    @Autowired
    private IngredientDetailRepository ingredientDetailRepository;
    @Autowired
    private OrderItemService orderItemService;
    @Autowired
    private InventoryOrderService inventoryOrderService;
    @Autowired
    private InventoryOrderRepository inventoryOrderRepository;


    public List<IngredientDetail> findAll() {
        return repo.findAll();
    }

    public IngredientDetail findById(int id) {
        if(!repo.existsById(id)) {
            throw new CustomException("Not Found !", HttpStatus.NOT_FOUND);
        }
        else{
            return repo.findById(id).get();
        }
    }

    public IngredientDetail save(IngredientDetail ingredientDetail) {
        eventPublisher.publishEvent(ingredientDetail);
        return repo.save(ingredientDetail);
    }

    public IngredientDetail update(IngredientDetail ingredientDetail) {
        if(repo.existsById(ingredientDetail.getId())) {
            return repo.save(ingredientDetail);
        }
       else {
           throw new CustomException("Not Found !", HttpStatus.NOT_FOUND);
        }
    }

    public void delete(int id) {
        if(repo.existsById(id)) {
            repo.deleteById(id);
        }
        else {
            throw new CustomException("Not Found !", HttpStatus.NOT_FOUND);
        }

    }

    public List<Ingredient> getLowStockIngredient(){
        List<Ingredient> ingredients = ingredientService.getAllIngredients();
        List<Ingredient> lowStock = new ArrayList<>();
        for(Ingredient ingredient : ingredients){
            List<IngredientDetail> details = findByIngredient(ingredient.getId());
            int quantity = 0;
            for(IngredientDetail detail : details){
                quantity+=detail.getQuantity();
            }
            if(quantity<10){
                lowStock.add(ingredient);
            }
        }
        return lowStock;
    }

    public List<IngredientDetail> findByIngredient(int id){
        return repo.findByIngredientId(id);
    }

    public void setActive(int id){
        IngredientDetail ingredientDetail = repo.findById(id).get();
        if(ingredientDetail.isActive()){
            ingredientDetail.setActive(false);
        }
        else{
            ingredientDetail.setActive(true);
        }
        repo.save(ingredientDetail);
    }
    public boolean isEnoughIngredient(Map<Integer, Integer> ingredientMap) {
        for (Map.Entry<Integer, Integer> entry : ingredientMap.entrySet()) {
            int ingredientId = entry.getKey();
            int quantityNeeded = entry.getValue();
            List<IngredientDetail> ingredients = ingredientDetailRepository
                    .findByIngredientIdOrderByExpireDateAsc(ingredientId);

            int totalAvailable = 0;
            for (IngredientDetail i : ingredients) {
                int available = i.getQuantity() - i.getReserved();
                if (available > 0) {
                    totalAvailable += available;
                }

                if (totalAvailable >= quantityNeeded) break;
            }

            if (totalAvailable < quantityNeeded) {
                return false; // thiếu nguyên liệu này
            }
        }

        return true; // đủ hết
    }

    public Map<Integer,Integer> getIngredientFromDish(List<OrderItemDTO> orderItems){
        Map<Integer,Integer> ingredient = new HashMap<>();
        Menus menus = new Menus();
        List<Integer> dishes = new ArrayList<>();
        for (OrderItemDTO orderItem : orderItems) {
            if(orderItem.getQuantity()>=2){
                System.out.println(orderItem.getQuantity());
                for(int i = 1;i<orderItem.getQuantity();i++){
                    dishes.add(orderItem.getDishId());
                }
            }
            dishes.add(orderItem.getDishId());
        }
        menus.setMenus(dishes);
        Menu menu = menuService.getMenu(menus);
        for(IngredientDTO i : menu.getData()) {
            ingredient.put(i.getId(), i.getQuantity());
        }
        return ingredient;
    }

//    public Map<Integer,Integer> getIngredientFromDish1(List<OrderItemDTO> orderItems){
//        System.out.println("getIngredientFromDish");
//        //map này chứa ingredient id và quanity
//        Map<Integer,Integer> ingredient = new HashMap<>();
//        for (OrderItemDTO item : orderItems) {
//            String dishId = item.getDishId();
//            int quantity = item.getQuantity();
//            // Tìm món ăn theo dishId
//            MenuDTO menu = menuService.getMenuById(dishId);
//        //lấy công thức từ menu ra và nhân lại để tính ra số lượng ngueyen liệu cần
//        for(ReceiptItem r : menu.getReceipt()) {
//            int ingredientId = r.getIdIngredient();
//            int totalQuantity = r.getQuantity() * quantity;
//
//            //nếu có nguyên liệu trùng trong món thì cộng dồn cho nguyên liệu đó
//            if (!ingredient.containsKey(ingredientId)) {
//                ingredient.put(ingredientId, totalQuantity);
//            } else {
//                int old = ingredient.get(ingredientId);
//                ingredient.put(ingredientId, old + totalQuantity);
//            }
//        }
//        }
//        return ingredient;
//    }

    @Transactional
    public void reserveIngredients(Map<Integer, Integer> ingredientMap,InventoryOrder order) {
        for (Map.Entry<Integer, Integer> entry : ingredientMap.entrySet()) {
            int ingredientId = entry.getKey();
            int quantityToReserve = entry.getValue();
            List<IngredientDetail> details = ingredientDetailRepository
                    .findByIngredientIdOrderByExpireDateAsc(ingredientId);

            for (IngredientDetail i : details) {
                IngredientDetail locked = ingredientDetailRepository.lockById(i.getId());
                //lock lại detail đang thao tác

                int available = locked.getQuantity() - locked.getReserved();

                if (available <= 0) continue;
                //Nếu lô hiện tại không còn nguyên liệu thì bỏ qua, chuyển sang lô tiếp theo.

                int reserveAmount;
                if (available < quantityToReserve) {
                    reserveAmount = available;
                } else {
                    reserveAmount = quantityToReserve;
                }
                int oldReserved = locked.getReserved();
                int newReserved = oldReserved + reserveAmount;
                locked.setReserved(newReserved);
                locked.setLastReservedAt(Timestamp.valueOf(LocalDateTime.now()));

                //lưu item
                saveItem(reserveAmount,order,locked.getId());

                quantityToReserve -= reserveAmount;
                ingredientDetailRepository.save(locked);
                if (quantityToReserve == 0) break;
            }

        }
        ingredientDetailRepository.flush();
    }

    public InventoryOrder saveOrder(List<OrderItemDTO> orderItems){
        return inventoryOrderService.save(new InventoryOrder(orderItems.get(0).getOrder().getOrderId(),Timestamp.valueOf(LocalDateTime.now())));
    }

    public void saveItem(int quantityToReserve,InventoryOrder order,int detailId){
            orderItemService.save(new OrderItem(detailId,quantityToReserve,order));
    }

    @Transactional
    public boolean checkAvaiable(List<OrderItemDTO> orderItems) {
        Map<Integer,Integer> ingredients = getIngredientFromDish(orderItems);
        if(!isEnoughIngredient(ingredients)){
            return false;
        }
        else{
            InventoryOrder order = saveOrder(orderItems);
            reserveIngredients(ingredients,order);
            return true;
        }
    }

    @Transactional
    public void resetReserve(int orderId){
        List<OrderItem> list = orderItemService.findByInventoryOrder_Id(orderId);
        for(OrderItem i : list){
            IngredientDetail detail = findById(i.getIngredientDetailId());
            int resetReserve = i.getQuantity();
            int newReserve = detail.getReserved() - resetReserve;
            detail.setReserved(newReserve);
            ingredientDetailRepository.save(detail);
        }


    }

    @Transactional
    public void deleteAllOrderItems(int id) {
        List<OrderItem> items = orderItemService.findByInventoryOrder_Id(id);
        for (OrderItem i : items) {
            if(i.getInventoryOrder().getId() == id){
                orderItemService.deleteByInventoryOrder_Id(i.getInventoryOrder().getId());
            }
        }
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void reserve(){
        List<InventoryOrder> orders = inventoryOrderService.findAll();
        for(InventoryOrder order : orders){
            if (order.getReceivedAt().before(Timestamp.valueOf(LocalDateTime.now().minusMinutes(10)))) {
                resetReserve(order.getId());
                InventoryOrder inventoryOrder = inventoryOrderService.findByOrderId(order.getOrderId());
                deleteAllOrderItems(inventoryOrder.getId());
                inventoryOrderService.delete(inventoryOrder.getId());
            }
        }

    }

    @Transactional
    public void doneOrder(int orderId){
        List<OrderItem> list = orderItemService.findByOrder(orderId);
        for(OrderItem i : list){
            IngredientDetail detail = findById(i.getIngredientDetailId());
            int newReserve = detail.getReserved() - i.getQuantity();
            detail.setReserved(newReserve);
            int newQuantity = detail.getQuantity() - i.getQuantity();
            detail.setQuantity(newQuantity);
            save(detail);
        }
        InventoryOrder order = inventoryOrderService.findByOrderId(orderId);
        deleteAllOrderItems(order.getId());
        inventoryOrderService.delete(order.getId());
        inventoryOrderRepository.flush();
    }
}
