package tasteflow.InventoryService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tasteflow.InventoryService.dto.Menu;
import tasteflow.InventoryService.dto.MenuDTO;
import tasteflow.InventoryService.dto.Menus;
import tasteflow.InventoryService.service.MenuService;
import tasteflow.InventoryService.service.OrderItemService;

import java.util.List;

@RestController
@RequestMapping("test")
public class TestController {
    @Autowired
    private MenuService menuService;
    @Autowired
    private OrderItemService orderItemService;

    @GetMapping("/menu")
    public List<MenuDTO> getMenuIngredients() {
        System.out.println("Controller");
        return menuService.getAllMenus();
    }
    @GetMapping("/{id}")
    public MenuDTO getMenu(@PathVariable("id") String id) {
        System.out.println(id);
        System.out.println(menuService.getMenuById(id)+"Controller");
        return menuService.getMenuById(id);
    }


    @PostMapping("/ingredient")
    public Menu get(@RequestBody Menus menus) {
        return menuService.getMenu(menus);
    }
}
