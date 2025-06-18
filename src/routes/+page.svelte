<script lang="ts">
    import {
        ToolBar,
        MainView,
        Sidebar,
        Preview,
        Infobar
    } from "$lib/components/index";
    import "$lib/app.css";
    import { onMount, tick } from 'svelte';
    import { themeStore } from "$lib/stores";
    import type { DirInfo, History, Update } from "$lib/types";
    import { set_update, load_settings, search, get_files } from "$lib/utils";
    import { WebGlShader } from "svader";

    let isLoading: boolean = true;
    let searchTerm: string = "";
    let history: History = { paths: [{get_function:"filesystem", get_input:"C:\\", name_in_addressbar:"C:\\"}], index: 0 };
    let path: string = "C:\\";
    let files: DirInfo = { elements: [], name: "", sub_dirs: 0, sub_files: 0 };
    let update: Update = {get_files: false, mainview: false, search: false};

    let sidebarWidth = 100;
    let previewWidth = 100;
    let resizingTarget: "sidebar" | "preview" | null = null;
    let selectedFiles: { selected: boolean, path: string }[];
    let contextmenu_info: {
        show: boolean,
        pos: {x: number, y: number},
    } = { show: false, pos: {x: 0, y: 0}};
    let settings_info: {
        show: boolean,
    } = { show: false };

    // Das hier ist der Shadercode der die Schöne Demo Animation macht
    const shaderCode = `#version 300 es
    precision highp float;

    out vec4 fragColor;

    uniform vec2 u_resolution;
    uniform float u_time;

    vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 uv = (fragCoord * 2.0 - u_resolution) / u_resolution.y;
        vec2 uv0 = uv;
        vec3 finalColor = vec3(0.0);

        for (float i = 0.0; i < 4.0; i++) {
            uv = fract(uv * 1.5) - 0.5;

            float d = length(uv) * exp(-length(uv0));

            vec3 col = palette(length(uv0) + i * 0.4 + u_time * 0.4);

            d = sin(d * 8.0 + u_time) / 8.0;
            d = abs(d);
            d = pow(0.005 / d, 1.2);

            finalColor += col * d;
        }

        fragColor = vec4(finalColor, 1.0);
    }
    `;

    // das hier wird ausgeführt nachdem die Seite vollständig geladen ist
    onMount(async () => {
        isLoading = true;
        themeStore.init();
        themeStore.setTheme("abyss");
        update = {get_files: false, mainview: true, search: false};
        load_settings();
        await loadFiles();
    });

    // diese funktion wird gebraucht um die Dokumente vom filesystem zu bekommen und laden
    async function loadFiles() {
        try {
            if (history.paths[history.index].get_function === "search") {
                files = await search(history.paths[history.index].get_input);
            } else if (history.paths[history.index].get_function === "filesystem") {
                files = await get_files(history.paths[history.index].get_input);
            } else {
                console.error("Unknown get_function:", history.paths[history.index].get_function);
            }
            await tick(); // Ensure DOM updates before resetting selection
            selectedFiles = files.elements.map(() => ({ selected: false, path: "" }));
        } catch (err) {
            console.error("Error fetching files:", err);
        }
    }

    function startResize(target: "sidebar" | "preview") {
        resizingTarget = target;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopResize);
    }

    function resize(event: MouseEvent) {
        if (!resizingTarget) return;

        if (resizingTarget === "sidebar") {
            let newWidth = event.clientX;
            sidebarWidth = Math.max(10, newWidth);
        } else if (resizingTarget === "preview") {
            let docWidth = document.body.clientWidth;
            let newWidth = docWidth - event.clientX;
            previewWidth = Math.max(10, newWidth);
        }
    }

    function stopResize() {
        resizingTarget = null;
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
    }
</script>

<!-- Hier wird das Aussehen der App definiert -->
{#if isLoading}
    <div class="fullscreen-loader">
        <WebGlShader
            width="100vw"
            height="100vh"
            code={shaderCode}
            parameters={[
                { name: "u_resolution", value: "resolution" },
                { name: "u_time", value: "time" },
            ]}
        >
            <div class="fallback">WebGL not supported in this environment.</div>
        </WebGlShader>

        <div class="loading-text">
            <center>
                <h1>Demo</h1>

                <p style="color: red;">
                    Nach dem sie de Demo getestet haben bitte drücken sie CTRL + R
                </p>
                <p>
                    Dieser File Explorer hat die folgenden features
                </p>
                <ul style="display: flex; flex-direction: column; align-items: center;">
                    <li>schnelle Suchfunktion</li>
                    <li>kleine installations datei</li>
                </ul>
            </center>
        </div>

        <button class="continue-button" on:click={() => isLoading = false}>
            Continue
        </button>
    </div>
{:else}
    <div class="app-container">
        <ToolBar 
            bind:searchTerm
            bind:adress={path}
            bind:update
            bind:history
        />
        <div class="content-container">
            <!-- Sidebar -->
            <div class="sidebar" style="width: {sidebarWidth}px;">
                <Sidebar />
            </div>
            <!-- Sidebar Resizer -->
            <div class="resizer" on:mousedown={() => startResize("sidebar")}></div>

            <!-- MainView -->
            <div class="main-view"> 
                <MainView
                    bind:path
                    bind:files
                    bind:update
                    bind:searchTerm
                    bind:history
                    bind:selectedFiles
                    bind:contextmenu_info
                    bind:settings_info
                />
            </div>
            <!-- Preview Resizer -->
            <div class="resizer" on:mousedown={() => startResize("preview")}></div>

            <!-- Preview -->
            <div class="preview" style="width: {previewWidth}px;">
                <Preview
                    bind:selectedFiles
                />
            </div>
        </div>
        <Infobar
            bind:files
            bind:history
            bind:settings_info
        />
    </div>
{/if}

<!-- Hier werden den Oben definierten elementen noch farbe, grösse usw. zugeteilt -->
<style>
    :root {
        width: 100%;
        height: 100%;
        background-color: var(--primary-color);
    }

    .fullscreen-loader {
        position: relative;
        width: 100vw;
        height: 100vh;
    }

    .loading-text {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        max-width: 800px;
        padding: 2em;
        background-color: var(--accent-color, #fffff000);
        color: white;
        text-align: center;
        font-size: 1.2rem;
        border-radius: 10px;
        backdrop-filter: blur(5px);
        z-index: 1;
        border: 1px solid white;
    }

    .continue-button {
        position: absolute;
        bottom: 5%;
        left: 50%;
        transform: translateX(-50%);
        padding: 0.8em 1.5em;
        background-color: var(--accent-color, #fffff000);
        color: white;
        font-size: 1rem;
        border: 1px solid white;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1;
        backdrop-filter: blur(5px);
        transition: background-color 0.3s ease;
    }

    .continue-button:hover {
        background-color: var(--accent-hover, #ffffff55);
    }

    .app-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .content-container {
        flex: 1;
        display: flex;
        overflow: hidden;
    }

    .sidebar {
        background-color: var(--secondary-color);
    }

    .preview {
        background-color: var(--secondary-color);
    }

    .main-view {
        flex: 1;
        overflow: hidden;
        user-select: none;
    }

    .resizer {
        width: 5px;
        height: 100%;
        background-color: var(--border-color);
        cursor: ew-resize;
    }

    .resizer:hover {
        background-color: var(--selected-color);
    }
</style>
