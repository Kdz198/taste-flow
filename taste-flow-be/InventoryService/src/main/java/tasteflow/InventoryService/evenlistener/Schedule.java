package tasteflow.InventoryService.evenlistener;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tasteflow.InventoryService.model.Ingredient;
import tasteflow.InventoryService.model.IngredientDetail;
import tasteflow.InventoryService.repository.IngredientDetailRepository;
import tasteflow.InventoryService.repository.IngredientRepository;
import tasteflow.InventoryService.service.IngredientDetailService;
import tasteflow.InventoryService.service.IngredientService;

import java.sql.Date;
import java.time.LocalDate;

@Service
public class Schedule {
    @Autowired
    private IngredientDetailRepository ingredientDetailRepository;
    @Autowired
    private IngredientDetailService ingredientDetailService;
    @Autowired
    private IngredientService ingredientService;
    @Autowired
    private IngredientRepository ingredientRepository;


    //Check quantity và set off cho detail
    @Scheduled(cron = "0 00 7 * * ?")
    public void checkQuantity(){
        for(IngredientDetail i : ingredientDetailRepository.findAll()){
            if(i.getQuantity()==0){
                i.setActive(false);
                ingredientDetailRepository.save(i);
            }
        }
    }
    //neu detail het han thi set ve 0
    @Scheduled(cron ="0 00 7 * * ?")
    public void checkIngredient(){
        for(IngredientDetail i : ingredientDetailRepository.findAll()){
            if(i.getExpireDate().before(Date.valueOf(LocalDate.now()))){
                i.setActive(false);
                ingredientDetailRepository.save(i);
            }
        }
    }

    //neu tat ca detail ve 0 thì set ingredient ve 0
    @EventListener
    public void checkIngredientDetail(int ingredientId){
        boolean found = false;
        for(IngredientDetail i : ingredientDetailService.findByIngredient(ingredientId)){
            if(i.isActive()){
                found = true;
                break;
            }
        }

        if(!found){
            Ingredient ingredient = ingredientService.getIngredientById(ingredientId);
            ingredient.setActive(false);
            ingredientRepository.save(ingredient);
        }
    }

}
