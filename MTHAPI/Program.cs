using DAL.UnitOfWork;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Runtime.Intrinsics.X86;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<MTHDbContext>();
builder.Services.AddIdentity<MTHUser, IdentityRole>()
                .AddEntityFrameworkStores<MTHDbContext>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddEndpointsApiExplorer();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
        policy.WithOrigins("http://localhost:55452") // Angular dev server
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});


var app = builder.Build();

app.UseCors("AllowAngularDev");

app.MapControllers();

app.Run();
