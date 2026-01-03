using Application.Bills.DTOs;
using FluentValidation;

namespace Application.Bills.Validators
{
    public class CreateBillValidator : AbstractValidator<CreateBillDto>
    {
        public CreateBillValidator()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Tytuł jest wymagany"); 
            RuleFor(x => x.Amount).GreaterThan(0).WithMessage("Kwota musi być większa od 0");
            RuleFor(x => x.DueDate).NotEmpty();
            RuleFor(x => x.ApartmentId).NotEmpty();
        }
    }
}