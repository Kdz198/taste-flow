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

        public ApiResponse( string message, T data, bool success = true )
        {
            Message = message;
            Data = data;
            Success = success;
        }
    }
}
