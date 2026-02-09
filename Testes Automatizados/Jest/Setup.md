## ## Como configurar os testes com Jest

1. **Instalar o Jest como dependência de desenvolvimento:**

```bash
npm install --save-dev jest
Adicionar os scripts no package.json:
```

2. 

```
"scripts": { 
  "test": "jest",  // Executa os testes uma vez.
  "test:watch": "jest --watch"  // Fica observando alterações e executa os testes automaticamente quando você salva um arquivo.
}