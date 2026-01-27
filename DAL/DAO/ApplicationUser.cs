using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

// Inherit from IdentityUser to get all the built-in authentication fields.
public class ApplicationUser : IdentityUser
{
    // You can add custom properties here.
    // Let's add the 'Name' property from your original User model.
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    // Navigation properties can be added as before
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}