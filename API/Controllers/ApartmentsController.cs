using Application.Apartments.Commands;
using Application.Apartments.DTOs;
using Application.Apartments.Queries;
using Application.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ApartmentsController : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<ApartmentDto, DateTime?>>> GetApartments([FromQuery] ApartmentParams apartmentParams)
    {
        return HandleResult(await Mediator.Send(new GetApartmentList.Query { Params = apartmentParams }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApartmentDto>> GetApartmentDetail(string id)
    {
        return HandleResult(await Mediator.Send(new GetApartmentDetails.Query { Id = id }));
    }

    [HttpPost]
    public async Task<ActionResult<string>> CreateApartment(CreateApartmentDto apartmentDto)
    {
        return HandleResult(await Mediator.Send(new CreateApartment.Command { ApartmentDto = apartmentDto }));
    }

    [Authorize(Policy = "IsApartmentOwner")]
    [HttpPut("{id}")]
    public async Task<ActionResult> EditApartment(string id, EditApartmentDto apartmentDto)
    {
        apartmentDto.Id = id;
        return HandleResult(await Mediator.Send(new EditApartment.Command { ApartmentDto = apartmentDto }));
    }

    [Authorize(Policy = "IsApartmentOwner")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteApartment(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteApartment.Command { Id = id }));
    }

    [HttpPost("{id}/apply")]
    public async Task<ActionResult> ApplyToApartment(string id)
    {
        return HandleResult(await Mediator.Send(new ApplyToApartment.Command { Id = id }));
    }

    [HttpPut("{id}/members/{userId}")]
    public async Task<ActionResult> UpdateMemberStatus(string id, string userId, MemberStatusDto statusDto)
    {
        return HandleResult(await Mediator.Send(new UpdateMemberStatus.Command
        {
            Id = id,
            UserId = userId,
            MemberStatus = statusDto.Status
        }));
    }
}
