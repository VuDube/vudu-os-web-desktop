<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { appStore } from '$lib/stores/appStore';
  import { aiStore } from '$lib/stores/aiStore';
  import Taskbar from './Taskbar.svelte';
  import WindowManager from './WindowManager.svelte';
  
  let desktopRef: HTMLDivElement;
  let backgroundStyle = '';
  
  $: theme = $appStore.userSettings.theme;
  $: accentColor = $appStore.userSettings.accentColor;
  $: background = $appStore.userSettings.desktopBackground;

  onMount(() => {
    // Initialize theme and styles
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--accent-color', accentColor);
    
    // Set dynamic background with blur layers for glassmorphism
    backgroundStyle = `
      background-image: url('${background}');
      background-size: cover;
      background-position: center;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      filter: saturate(1.2) brightness(0.7);
    `;
  });
</script>

<div class="desktop" bind:this={desktopRef}>
  <div style={backgroundStyle} />
  
  <div class="desktop-overlay">
    <WindowManager />
  </div>
  
  <Taskbar />
</div>

<style>
  .desktop {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .desktop-overlay {
    position: relative;
    z-index: 1;
    height: calc(100vh - 60px);
  }
</style>