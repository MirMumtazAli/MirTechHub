namespace MTHAPI.DTO.Order
{
    public class OrderUpdateDto
    {
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; }
    }
}
