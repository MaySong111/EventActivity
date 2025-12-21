namespace API.core.Dtos.Activity
{
    public class ResponseActivityDto<T>
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
    }
}