package tasteflow.InventoryService.RabbitMQ;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }


    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }

    @Bean
    public Queue inventoryQueue() {
        return new Queue("inventory.queue");
    }

    @Bean
    public Queue paymentQueue() {
        return new Queue("paymentOfInventory.queue");
    }

    @Bean
    public TopicExchange orderExchange() {
        return new TopicExchange("order.exchange");
    }

    @Bean
    public TopicExchange inventoryExchange() {
        return new TopicExchange("inventory.exchange");
    }

    @Bean
    public TopicExchange paymentExchange() {
        return new TopicExchange("payment.exchange");
    }

    @Bean
    public Binding bindingOrder() {
        return BindingBuilder
                .bind(inventoryQueue())
                .to(orderExchange())
                .with("order.created");
    }

    @Bean
    public Binding bindingPayment() {
        return BindingBuilder
                .bind(paymentQueue())
                .to(paymentExchange())
                .with("payment.confirmed");
    }
}
