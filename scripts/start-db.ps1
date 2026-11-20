Write-Host "Starting local PostgreSQL server on 127.0.0.1:5433..." -ForegroundColor Green
& "C:\Program Files\PostgreSQL\18\bin\postgres.exe" -D "d:\realestate-project\.pgdata" -h 127.0.0.1 -p 5433
