namespace MTHAPI.DTO.Cart
{
    public class CartItemCreateDto
    {
        public int UserId { get; set; }
        public int? NoteId { get; set; }
        public int? SoftwareId { get; set; }
    }

}
