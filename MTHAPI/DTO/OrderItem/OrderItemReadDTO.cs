namespace MTHAPI.DTO.OrderItem
{
    // For reading OrderItem data

    public class OrderItemReadDTO
    {
        public int Id { get; set; }
        public int OrderId { get; set; }

        public int? NoteId { get; set; }
        public string? NoteTitle { get; set; }

        public int? SoftwareId { get; set; }
        public string? SoftwareName { get; set; }

        public decimal Price { get; set; }
    }
}
