# Compile
First, run this command to install all dependencies:
```bash
npm install
```
Then, run this command to build locally:
```bash
npm run tauri dev
```
Optionally, you can also run this command to build the project (e.g., for creating an MSI installer):
```bash
npm run tauri build
```

# TODO / Ideas

- Add https://github.com/probablykasper/svelte-tauri-filedrop to add filedrop to main content
- Add deeplinking so app gets opened by default https://v2.tauri.app/plugin/deep-linking/

<span style="color:red font-size:large"> BEFORE RELEASE </span>.
- remove devtools feature flag for tauri in cargo.toml
