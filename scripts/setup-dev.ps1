# Script para configurar ambiente de desenvolvimento no Windows
# - Inicia Postgres via Docker Compose
# - Cria .env a partir de .env.example se não existir
# - Aguarda Postgres, aplica migrations, gera client e executa seed

Write-Host "== Setup de desenvolvimento =="

if (!(Test-Path -Path ".env")) {
  if (Test-Path -Path ".env.example") {
    Copy-Item -Path ".env.example" -Destination ".env"
    Write-Host ".env criado a partir de .env.example. Edite se necessário."
  } else {
    Write-Error ".env.example não encontrado. Crie um .env manualmente."; exit 1
  }
}

Write-Host "Subindo serviço Postgres (docker compose up -d)..."
docker compose up -d

Write-Host "Aguardando Postgres responder na porta 5432..."
$max = 30
$ok = $false
for ($i=0; $i -lt $max; $i++) {
  $conn = Test-NetConnection -ComputerName 'localhost' -Port 5432 -WarningAction SilentlyContinue
  if ($conn.TcpTestSucceeded) { $ok = $true; break }
  Start-Sleep -Seconds 2
}
if (-not $ok) { Write-Error "Postgres não respondeu em tempo. Verifique o Docker."; exit 1 }

Write-Host "Aplicando migrations (prisma migrate deploy)..."
npx prisma migrate deploy

Write-Host "Gerando Prisma Client..."
npx prisma generate

Write-Host "Rodando seed..."
npm run prisma:seed

Write-Host "Pronto - inicie a aplicacao com: npm run dev"
