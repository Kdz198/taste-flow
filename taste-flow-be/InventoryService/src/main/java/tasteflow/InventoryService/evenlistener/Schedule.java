package tasteflow.InventoryService.evenlistener;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import tasteflow.InventoryService.model.IngredientDetail;
import tasteflow.InventoryService.repository.IngredientDetailRepository;
import tasteflow.InventoryService.service.IngredientDetailService;

@Service
public class Schedule {
    @Autowired
    private IngredientDetailRepository ingredientDetailRepository;


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

    //neu tat ca detail ve 0 thì set ingredient ve 0
}
