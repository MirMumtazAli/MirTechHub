namespace MTHAPI.DTO.OrderItem
{
    // For creating/updating OrderItem
    public class OrderItemCreateUpdateDTO
    {
        public int OrderId { get; set; }
        public int? NoteId { get; set; }
        public int? SoftwareId { get; set; }
        public decimal Price { get; set; }
    }
}
