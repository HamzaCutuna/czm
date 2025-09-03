namespace CZM1.API.Services
{
    public interface IMyImageHelper
    {
        Task<Stream> ResizeImageAsync(Stream originalStream, int maxWidth, int maxHeight);
    }
}
