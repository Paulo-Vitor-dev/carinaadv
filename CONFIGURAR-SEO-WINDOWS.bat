@echo off
setlocal
cd /d "%~dp0"
echo.
echo Configuracao de SEO - Carina Pessoa Advogada
echo Digite a URL publica definitiva (exemplo: https://seu-dominio.com.br)
echo.
set /p DOMINIO=URL definitiva: 
if "%DOMINIO%"=="" (
  echo ERRO: URL nao informada.
  pause
  exit /b 1
)
node scripts\configurar-seo.mjs "%DOMINIO%"
if errorlevel 1 (
  echo Verifique a URL digitada e se Node.js esta instalado.
  pause
  exit /b 1
)
node scripts\verificar-seo.mjs
if errorlevel 1 (
  echo Validacao nao passou. Confira a configuracao.
  pause
  exit /b 1
)
echo.
echo SEO configurado. Agora voce pode publicar os arquivos.
pause
