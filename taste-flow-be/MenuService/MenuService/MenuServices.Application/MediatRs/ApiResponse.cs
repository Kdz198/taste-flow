namespace MenuServices.Application.MediatRs
{
    public class ApiResponse<T> where T : class
    {
        public bool Success { get; set; } = true;
        public string Message
        {
            get; set;
        }
        public T Data
        {
            get; set;
        }

        public ApiResponse()
        {
            Message = string.Empty;
            Data = null!;
        }

        public ApiResponse( string message, T data )
        {
            Message = message ?? string.Empty;
            Data = data;
        }

        public ApiResponse( bool success, string message, T data )
        {
            Success = success;
            Message = message ?? string.Empty;
            Data = data;
        }
    }
}
