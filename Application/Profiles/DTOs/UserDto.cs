using System;

namespace Application.Profiles.DTOs;

public class UserDto
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public string? FirstName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    public string? ImageUrl { get; set; }
    public required string UserRole { get; set; }
}
