package tasteflow.InventoryService.feignclient;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import tasteflow.InventoryService.dto.Menu;
import tasteflow.InventoryService.dto.MenuDTO;
import tasteflow.InventoryService.dto.Menus;

import java.util.List;


@FeignClient(name = "MENU-SERVICE")
public interface MenuClient {
    @GetMapping("/api/menu")
   List<MenuDTO> getMenus();

    @GetMapping("api/menu/{id}")
    MenuDTO getMenuById(@PathVariable("id") String id);

    @PostMapping("api/menus/ingredients")
    Menu getIngredient(@RequestBody Menus menus);
}
