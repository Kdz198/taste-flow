using MediatR;

namespace MenuServices.Application.MediatRs.DumpData.MediatR
{
    public record DumpCommand() : IRequest<ApiResponse<Object>>;


}
