package tasteflow.InventoryService.evenlistener;


import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class Schedule {

    //Check quantity và set off cho detail
    @Scheduled(cron = "0 00 7 * * ?")
    public void checkQuantity(){

    }
}
