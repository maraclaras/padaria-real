# Script de testes da API Backend
$BASE_URL = "http://localhost:8080/api"
$WAIT_TIME = 3

Write-Host "================================" -ForegroundColor Cyan
Write-Host "TESTES DA API BACKEND" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

# Aguarda o backend ficar pronto
Write-Host "[1/6] Aguardando backend inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds $WAIT_TIME

# Teste 1: GET /api/products - Listar todos os produtos
Write-Host "`n[2/6] GET /api/products - Listar todos" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/products" -Method Get -ErrorAction Stop
    $products = $response.Content | ConvertFrom-Json
    Write-Host "Status: 200 OK ✓" -ForegroundColor Green
    Write-Host "Produtos encontrados: $($products.Count)" -ForegroundColor Green
    $products | ForEach-Object {
        Write-Host "  - ID: $($_.id), Nome: $($_.name), Preço: R$ $($_.price), QTD: $($_.quantity)" -ForegroundColor White
    }
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 2: GET /api/products/{id} - Obter um produto específico
Write-Host "`n[3/6] GET /api/products/1 - Obter produto por ID" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/products/1" -Method Get -ErrorAction Stop
    $product = $response.Content | ConvertFrom-Json
    Write-Host "Status: 200 OK ✓" -ForegroundColor Green
    Write-Host "Produto: $($product.name) - Preço: R$ $($product.price)" -ForegroundColor Green
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 3: GET /api/products/search?name=Pão - Buscar por nome
Write-Host "`n[4/6] GET /api/products/search?name=Pão - Buscar por nome" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/products/search?name=Pão" -Method Get -ErrorAction Stop
    $products = $response.Content | ConvertFrom-Json
    Write-Host "Status: 200 OK ✓" -ForegroundColor Green
    Write-Host "Produtos encontrados: $($products.Count)" -ForegroundColor Green
    $products | ForEach-Object {
        Write-Host "  - $($_.name) (QTD: $($_.quantity))" -ForegroundColor White
    }
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 4: GET /api/products/category/Pão - Listar por categoria
Write-Host "`n[5/6] GET /api/products/category/Pão - Listar por categoria" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/products/category/Pão" -Method Get -ErrorAction Stop
    $products = $response.Content | ConvertFrom-Json
    Write-Host "Status: 200 OK ✓" -ForegroundColor Green
    Write-Host "Produtos nesta categoria: $($products.Count)" -ForegroundColor Green
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 5: GET /api/products/available - Listar produtos disponíveis
Write-Host "`n[6/6] GET /api/products/available - Produtos disponíveis" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/products/available" -Method Get -ErrorAction Stop
    $products = $response.Content | ConvertFrom-Json
    Write-Host "Status: 200 OK ✓" -ForegroundColor Green
    Write-Host "Produtos em stock: $($products.Count)" -ForegroundColor Green
    $products | ForEach-Object {
        Write-Host "  - $($_.name) (QTD: $($_.quantity))" -ForegroundColor White
    }
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "TESTES CONCLUÍDOS" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
