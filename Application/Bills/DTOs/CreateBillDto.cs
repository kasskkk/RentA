using System;

namespace Application.Bills.DTOs;

public class CreateBillDto
{
    public required string ApartmentId { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }

}