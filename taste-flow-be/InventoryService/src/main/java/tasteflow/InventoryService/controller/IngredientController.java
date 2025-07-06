package tasteflow.InventoryService.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tasteflow.InventoryService.dto.MenuDTO;
import tasteflow.InventoryService.model.Ingredient;
import tasteflow.InventoryService.service.IngredientService;
import tasteflow.InventoryService.service.MenuService;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@CrossOrigin("*")
public class IngredientController {
    @Autowired
    private IngredientService service;


    @GetMapping
    public List<Ingredient> getAllIngredients() {
        return service.getAllIngredients();
    }

    @PostMapping
    public Ingredient addIngredient(@Valid @RequestBody Ingredient ingredient) {
        return service.addIngredient(ingredient);
    }

    @GetMapping("{id}")
    public Ingredient getIngredientById(@PathVariable int id) {
        return service.getIngredientById(id);
    }

    @PutMapping
    public Ingredient updateIngredient(@Valid @RequestBody Ingredient ingredient) {
        return service.updateIngredient(ingredient);
    }

    @DeleteMapping("{id}")
    public void deleteIngredient(@PathVariable int id) {
        service.deleteIngredient(id);
    }

    @GetMapping("/set-active/{id}")
    public void setActiveIngredient(@PathVariable int id) {
        service.setActive(id);
    }


    @GetMapping("/get-by-list-id")
    public List<Ingredient> getIngredientsByListId(@RequestBody List<Integer> listId) {
        return service.getIngredientsByID(listId);
    }
}
