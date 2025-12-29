using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    [Required]
    public string DisplayName { get; set; } = "";
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    [Required]
    public bool IsOwner { get; set; }
}
