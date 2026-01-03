using Application.Bills.Commands;
using Application.Bills.DTOs;
using Application.Bills.Queries; 
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BillsController : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> CreateBill(CreateBillDto billDto)
    {
        return HandleResult(await Mediator.Send(new CreateBill.Command { BillDto = billDto }));
    }

    [HttpGet("{apartmentId}")]
    public async Task<IActionResult> GetBills(string apartmentId)
{
    return HandleResult(await Mediator.Send(new GetBills.Query { ApartmentId = apartmentId }));
}
}