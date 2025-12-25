namespace MTHAPI.DTO.Admin
{
    // ================= UPDATE DTO (for cancelling or updating) =================
    public class AdminOrderUpdateDto
    {
        public string PaymentStatus { get; set; } // e.g., "Completed", "Cancelled"
    }
}
