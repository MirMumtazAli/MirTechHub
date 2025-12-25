namespace MTHAPI.DTO.Admin
{
    public class AdminOrderReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; }
        public System.DateTime OrderDate { get; set; }
    }

}
