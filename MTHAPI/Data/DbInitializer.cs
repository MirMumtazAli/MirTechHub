using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<MTHDbContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();

            // Apply any pending migrations to create the database if it doesn't exist
            await context.Database.MigrateAsync();

            // Seed Roles
            string[] roleNames = { "Admin", "User" };
            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Seed Admin Users from configuration
            var adminUsers = configuration.GetSection("AdminUsers").Get<List<AdminUserSeed>>();

            if (adminUsers != null)
            {
                foreach (var adminUserSeed in adminUsers)
                {
                    var user = await userManager.FindByEmailAsync(adminUserSeed.Email);
                    if (user == null)
                    {
                        var newAdmin = new ApplicationUser
                        {
                            UserName = adminUserSeed.Email,
                            Email = adminUserSeed.Email,
                            Name = adminUserSeed.Name,
                            EmailConfirmed = true
                        };
                        var createResult = await userManager.CreateAsync(newAdmin, adminUserSeed.Password);
                        if (createResult.Succeeded)
                        {
                            // Assign the new user to the "Admin" role
                            await userManager.AddToRoleAsync(newAdmin, "Admin");
                        }
                    }
                }
            }
        }
    }

    // Helper class to bind admin user configuration from appsettings.json
    public class AdminUserSeed
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
