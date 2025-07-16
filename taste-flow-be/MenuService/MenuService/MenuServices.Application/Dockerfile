FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj cụ thể
COPY MenuServices.Application.csproj .
RUN dotnet restore

# Copy mã nguồn và publish
COPY . .
RUN dotnet publish -c Release -o out

# Image runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 5252
ENV ASPNETCORE_URLS=http://+:5252
CMD ["dotnet", "MenuServices.Application.dll"]