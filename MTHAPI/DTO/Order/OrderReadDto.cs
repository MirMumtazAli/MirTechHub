namespace MTHAPI.DTO.Order
{
    public class OrderReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime OrderDate { get; set; }
    }

}
