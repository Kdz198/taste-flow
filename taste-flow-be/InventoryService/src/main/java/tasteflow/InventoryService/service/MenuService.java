package tasteflow.InventoryService.service;

import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tasteflow.InventoryService.dto.*;
import tasteflow.InventoryService.feignclient.MenuClient;

import java.util.List;

@Service
public class MenuService {
    @Autowired
    private MenuClient client;

    public List<MenuDTO> getAllMenus(){
        System.out.println("menuservice");
        return  client.getMenus();
    }

    public MenuDTO getMenuById(String menuId){
        System.out.println(client.getMenuById(menuId)+"Controller");
        return client.getMenuById(menuId);
    }

    public Menu getMenu(Menus menus){
        Menu menu = client.getIngredient(menus);
        for (IngredientDTO i : menu.getData()){
            System.out.println("Get from Client:");
            System.out.println(i.getId());
            System.out.println(i.getQuantity());
        }
        return client.getIngredient(menus);
    }
}
