# Compile
First, run this command to install all dependencies:
```powershell
npm install
```
Then, run this command to build locally:
```powershell
npm run tauri dev
```
Optionally, you can also run this command to build the project (e.g., for creating an MSI installer):
```powershell
npm run tauri build
```



# Dependencies

Using Iconify for some icons:
```powershell
npm install @iconify/svelte
```
Using svelte-i18n for different language support:
```powershell
npm install svelte-i18n
```


# TODO / Ideas

- convert css to SCSS <span style="background-color: #2c2740; border-radius: 10px; padding: 2px 6px; color: #ff80c0; font-weight: bold;">idea</span>
- investigate if seperate elements in html should be done seperatly <span style="background-color: #2c2740; border-radius: 10px; padding: 2px 6px; color: #ff80c0; font-weight: bold;">TODO</span>
- Add https://github.com/probablykasper/svelte-tauri-filedrop to add filedrop to main content
- Add deeplinking so app gets opened by default https://v2.tauri.app/plugin/deep-linking/

<span style="color:red font-size:large"> BEFORE RELEASE </span>.
- remove devtools feature flag for tauri in cargo.toml
- https://v2.tauri.app/plugin/store/ for store