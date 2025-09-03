using CZM1.API.Helpers;
using CZM1.API.Services;
using Serilog;
using System.Text;

namespace CZM1.API.Middlewares
{
    public class RequestLoggingMiddleware(RequestDelegate next)
    {
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context); // samo proslijedi ako je sve OK
            }
            catch (Exception ex)
            {
                var cancellationToken = context.RequestAborted;

                var errorInfo = await ErrorLoggerHelper.LogExceptionAsync(context, ex, cancellationToken);

                context.Response.StatusCode = 500;
                await context.Response.WriteAsync("Internal server error --> " + errorInfo);
            }
        }
    }
}
