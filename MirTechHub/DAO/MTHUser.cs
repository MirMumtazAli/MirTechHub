using Microsoft.AspNetCore.Identity;

public class MTHUser : IdentityUser
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Order> Orders { get; set; }
    public ICollection<Review> Reviews { get; set; }
}
