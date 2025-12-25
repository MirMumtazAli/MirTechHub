using DAL.DAO;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class MTHDbContext : IdentityDbContext<MTHUser>
{
    //public MTHDbContext(DbContextOptions<MTHDbContext> options)
    //    : base(options)
    //{
    //    Database.Migrate();
    //}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Database=StoreDb;Integrated Security=True;Encrypt=True;Trust Server Certificate=True");
    }

    public DbSet<Note> Notes { get; set; }
    public DbSet<Software> Softwares { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Cart> CartItems { get; set; }
    public DbSet<Blog> Blogs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Decimal precision
        builder.Entity<Note>()
            .Property(n => n.Price)
            .HasPrecision(10, 2);

        builder.Entity<Software>()
            .Property(s => s.Price)
            .HasPrecision(10, 2);

        builder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(10, 2);

        // Review rating constraint
        builder.Entity<Review>()
         .ToTable(t =>
             t.HasCheckConstraint("CK_Review_Rating", "Rating BETWEEN 1 AND 5")
         );


        // Review relationships
        builder.Entity<Review>()
            .HasOne(r => r.Note)
            .WithMany(n => n.Reviews)
            .HasForeignKey(r => r.NoteId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Review>()
            .HasOne(r => r.Software)
            .WithMany(s => s.Reviews)
            .HasForeignKey(r => r.SoftwareId)
            .OnDelete(DeleteBehavior.Restrict);

        // Order relationships
        builder.Entity<Order>()
            .HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId);

        // OrderItem polymorphic rule
        builder.Entity<OrderItem>()
            .HasOne(oi => oi.Note)
            .WithMany()
            .HasForeignKey(oi => oi.NoteId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<OrderItem>()
            .HasOne(oi => oi.Software)
            .WithMany()
            .HasForeignKey(oi => oi.SoftwareId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
