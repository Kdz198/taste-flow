namespace MenuServices.Application.Entities
{
    public class Ingredient
    {
        public int Id
        {
            get; set;
        }
        public int Quantity
        {
            get; set;
        }

        public int MenuItemId
        {
            get; set;
        }

        [System.Text.Json.Serialization.JsonIgnore]
        public Menu Menu { get; set; } = null!;
    }
}
