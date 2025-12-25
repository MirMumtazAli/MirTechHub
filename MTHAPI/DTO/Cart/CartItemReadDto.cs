namespace MTHAPI.DTO.Cart
{
    public class CartItemReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? NoteId { get; set; }
        public int? SoftwareId { get; set; }
        public decimal Price { get; set; }
    }

}
