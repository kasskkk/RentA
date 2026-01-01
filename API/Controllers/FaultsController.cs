using Application.Faults.Commands;
using Application.Faults.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class FaultsController : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> CreateFault(CreateFaultDto faultDto)
    {
        return HandleResult(await Mediator.Send(new CreateFault.Command { FaultDto = faultDto }));
    }
    [HttpPut("{id}/resolve")]
    public async Task<IActionResult> ResolveFault(string id)
    {
        return HandleResult(await Mediator.Send(new ResolveFault.Command { Id = id }));
    }
}