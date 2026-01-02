using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public DbSet<Apartment> Apartments { get; set; }
    public DbSet<ApartmentMember> ApartmentMembers { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Device> Devices { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApartmentMember>()
            .HasKey(x => new { x.ApartmentId, x.UserId });

        builder.Entity<ApartmentMember>()
            .HasOne(x => x.User)
            .WithMany(x => x.ApartmentMembers)
            .HasForeignKey(x => x.UserId);

        builder.Entity<ApartmentMember>()
            .HasOne(x => x.Apartment)
            .WithMany(x => x.ApartmentMembers)
            .HasForeignKey(x => x.ApartmentId);

    }
}