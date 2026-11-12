# 🧰 Configs: backup e restauração do Obsidian

Tudo que preciso pra deixar o Obsidian **exatamente igual** num PC novo (ou depois de um problema): plugins com o código, as configurações de cada um, temas, snippets CSS, ícones e atalhos.

> [!tip] Resumo
> - **Fazer backup:** `backup.ps1`
> - **Restaurar:** feche o Obsidian e rode `restaurar.ps1`
> - **A lista do que está instalado:** [[Extensões]] (gerada pelo script)

---

## 📁 O que tem aqui

| Item | O que é |
|---|---|
| `obsidian/` | **Espelho completo** da pasta `.obsidian` do vault. É a fonte da verdade do backup. |
| `backup.ps1` | Atualiza o espelho, apaga senhas/tokens da cópia e gera o `Extensões.md`. |
| `restaurar.ps1` | Coloca o espelho de volta no vault (guarda o `.obsidian` atual antes, por segurança). |
| `Extensões.md` | Lista gerada automaticamente: plugins, versões, temas, snippets e plugins nativos ativos. |

Dentro de `obsidian/`:

| Caminho | Conteúdo |
|---|---|
| `plugins/<id>/` | Código do plugin (`main.js`, `manifest.json`, `styles.css`) **e** as configurações dele (`data.json`) |
| `plugins/estudos-dashboard/` | Plugin feito por mim (não existe na loja: só dá pra recuperar daqui!) |
| `snippets/` | CSS: `homepage-dashboard.css` (visual da Homepage), cores das pastas, cursor... |
| `themes/` | AnuPpuccin (ativo) e Minimal |
| `icons/` | Pacotes de ícones do Iconize |
| `appearance.json` | Tema e snippets ativos |
| `community-plugins.json` | Quais plugins da comunidade estão ligados |
| `core-plugins.json` | Quais plugins nativos estão ligados |
| `hotkeys.json` | Meus atalhos |
| `app.json`, `graph.json` | Preferências do editor e do grafo |

**Fica de fora de propósito:** `workspace.json` (só lembra abas abertas e muda o tempo todo) e caches.

---

## 💾 Fazer backup

Rode sempre que instalar/configurar um plugin, mudar tema ou mexer em CSS:

```powershell
cd "C:\Users\eduar\OneDrive\Documentos\Obsidian Vault\estudos\Configs"
powershell -ExecutionPolicy Bypass -File .\backup.ps1
```

Depois o plugin **Git** faz o commit e envia pro GitHub junto com as notas (ou `Ctrl + S`, que está configurado pra dar push).

> [!warning] Senhas e tokens
> O script procura campos como `token`, `password`, `secret` e `apiKey` nos `data.json` e **apaga o valor na cópia** (o original continua no seu PC). Depois de restaurar, reconfigure o que tinha senha. Ele avisa no terminal quais arquivos mexeu.

---

## ♻️ Restaurar (PC novo ou deu problema)

1. **Instale** o [Obsidian](https://obsidian.md/download) e o [Git](https://git-scm.com/download/win).
2. **Baixe o vault**: crie a pasta `Obsidian Vault` e, dentro dela, clone o repositório:
   ```powershell
   mkdir "$HOME\OneDrive\Documentos\Obsidian Vault"
   cd "$HOME\OneDrive\Documentos\Obsidian Vault"
   git clone https://github.com/Eduardo-Virissimo/estudos.git
   ```
3. **Com o Obsidian fechado**, rode:
   ```powershell
   cd "$HOME\OneDrive\Documentos\Obsidian Vault\estudos\Configs"
   powershell -ExecutionPolicy Bypass -File .\restaurar.ps1
   ```
4. Abra o Obsidian → **Open folder as vault** → escolha `Obsidian Vault` (a pasta **de cima**, não a `estudos`).
5. Clique em **Trust author and enable plugins** e reinicie o Obsidian uma vez.
6. Reconfigure senhas/tokens (ex.: autenticação do Git, veja abaixo).

> [!info] Por que a pasta de cima?
> O vault é `Obsidian Vault/`, e o repositório de estudos fica em `Obsidian Vault/estudos/`. A Homepage está em `estudos/Homepage.md` e o plugin Homepage aponta pra esse caminho.

### Restaurar sem o script (manual)

Feche o Obsidian, copie a pasta `Configs/obsidian` para `Obsidian Vault/.obsidian` (renomeando), abra o Obsidian e habilite os plugins. Restaurar com o Obsidian **aberto** não funciona: ele sobrescreve as configs ao fechar.

---

## 🔐 Git e GitHub

Não coloque o token na URL do repositório (fica em texto puro no `.git/config`). Prefira o **Git Credential Manager**, que vem com o Git para Windows e guarda o login no cofre do Windows:

```powershell
git remote set-url origin https://github.com/Eduardo-Virissimo/estudos.git
git push   # abre o navegador para logar uma vez
```

---

## 🧩 A Ficha do herói (plugin Estudos RPG)

O painel de estudos é o plugin **`estudos-rpg`**, feito por mim. O código-fonte fica no repositório (`estudos/.sistema/estudos-rpg/`) e a versão compilada fica em `obsidian/plugins/estudos-rpg/` deste backup.

- **Num PC novo, não precisa compilar nada:** o `restaurar.ps1` já coloca o plugin pronto.
- **Para mexer no código:** instale o [Node.js](https://nodejs.org) (versão 22+) e siga o `README.md` do plugin (`npm install` e `npm run build`).
- Não depende de Dataview nem de snippet CSS. As fontes (Cinzel e EB Garamond) vêm do Google Fonts; sem internet, usa uma fonte serifada do sistema.
- O plugin antigo **Estudos Dashboard** e o snippet **`homepage-dashboard.css`** não são mais usados e podem ser desativados.

---

## 🗃️ Arquivos antigos

`appearance.json`, `community-plugins.json`, `cursor-smooth.css`, `custom-rainbow-colors.css`, `homepage-dashboard*.css` e `estudos-dashboard/` soltos nesta pasta são **cópias antigas** de antes do espelho. A versão atual de tudo está em `obsidian/`. Pode apagar.
